using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using static NetrokonaCms.Tests.Host;

namespace NetrokonaCms.Tests;

public class WorkflowTests : IDisposable
{
    private readonly Host _h = new();
    public void Dispose() => _h.Dispose();

    private async Task<(string Code, string Token)> Submit(HttpClient c, object payload, params (string, byte[])[] images)
    {
        var r = await c.PostAsync("/api/public/submissions", SubmissionForm(payload, images));
        Assert.True(r.StatusCode == HttpStatusCode.Created, await r.Content.ReadAsStringAsync());
        var j = await Json(r);
        return (j.GetProperty("trackingCode").GetString()!, j.GetProperty("editToken").GetString()!);
    }

    private static async Task<JsonElement> FindByCode(HttpClient admin, string code)
    {
        var list = await Json(await admin.GetAsync("/api/admin/submissions?q=" + code));
        var id = list.GetProperty("items")[0].GetProperty("id").GetString();
        return await Json(await admin.GetAsync("/api/admin/submissions/" + id));
    }

    private static Task<HttpResponseMessage> Approve(HttpClient c, JsonElement sub, bool publish) =>
        c.PostAsJsonAsync($"/api/admin/submissions/{sub.GetProperty("id").GetString()}/approve", new { publish, internalRemark = "checked", publicNote = "Thanks!", version = sub.GetProperty("version").GetInt32() });

    private static Task<HttpResponseMessage> Status(HttpClient c, JsonElement sub, string status, string? note) =>
        c.PostAsJsonAsync($"/api/admin/submissions/{sub.GetProperty("id").GetString()}/status", new { status, internalRemark = "r", publicNote = note, version = sub.GetProperty("version").GetInt32() });

    private async Task<int> PublicTotal(string query = "") => (await Json(await _h.Anonymous().GetAsync("/api/public/content" + query))).GetProperty("total").GetInt32();

    [Fact]
    public async Task Public_submission_is_pending_and_never_public_until_approved_and_published()
    {
        await _h.CreateMember("mod@example.com", "Admin");
        var admin = await _h.LoginAs("mod@example.com");
        var anon = _h.Anonymous();
        var (code, _) = await Submit(anon, NewPlace(), ("view.png", Png()));

        Assert.Equal(0, await PublicTotal());                                           // not public
        var track = await Json(await anon.GetAsync("/api/public/submissions/" + code));
        Assert.Equal("Pending", track.GetProperty("status").GetString());

        var sub = await FindByCode(admin, code);
        var mediaUrl = sub.GetProperty("media")[0].GetProperty("url").GetString()!;
        var mediaId = mediaUrl.Split('/')[^2];
        Assert.Equal(HttpStatusCode.NotFound, (await anon.GetAsync("/media/" + mediaId)).StatusCode);        // pending image is private
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync(mediaUrl)).StatusCode);                          // reviewer can see it

        // approve as DRAFT first: still not public
        Assert.Equal(HttpStatusCode.OK, (await Approve(admin, sub, publish: false)).StatusCode);
        Assert.Equal(0, await PublicTotal());
        var approved = await FindByCode(admin, code);
        var contentId = approved.GetProperty("resultContentId").GetString();
        var content = await Json(await admin.GetAsync("/api/admin/content/" + contentId));
        Assert.Equal("Draft", content.GetProperty("publishState").GetString());

        // publish explicitly
        var st = await admin.PostAsJsonAsync($"/api/admin/content/{contentId}/state", new { state = "Published", version = content.GetProperty("version").GetInt32() });
        Assert.Equal(HttpStatusCode.OK, st.StatusCode);
        Assert.Equal(1, await PublicTotal());

        var pub = await Json(await anon.GetAsync("/api/public/content?type=Place"));
        var item = pub.GetProperty("items")[0];
        Assert.Equal("Dingapota Haor Viewpoint", item.GetProperty("titleEn").GetString());
        var json = item.GetRawText();
        Assert.DoesNotContain("visitor@example.com", json);        // submitter contact never public
        Assert.DoesNotContain("submitter", json, StringComparison.OrdinalIgnoreCase);

        var img = await anon.GetAsync("/media/" + mediaId);                                                    // approved + published => public
        Assert.Equal(HttpStatusCode.OK, img.StatusCode);
        Assert.Equal("image/jpeg", img.Content.Headers.ContentType!.MediaType);
        Assert.Equal("nosniff", img.Headers.GetValues("X-Content-Type-Options").Single());

        // deactivate => hidden again, image too
        var cur = await Json(await admin.GetAsync("/api/admin/content/" + contentId));
        var fields = new { type = "Place", titleEn = "Dingapota Haor Viewpoint", upazilaId = "khaliajuri" };
        var put = await admin.PutAsJsonAsync("/api/admin/content/" + contentId, new { fields, isActive = false, version = cur.GetProperty("version").GetInt32() });
        Assert.Equal(HttpStatusCode.OK, put.StatusCode);
        Assert.Equal(0, await PublicTotal());
        Assert.Equal(HttpStatusCode.NotFound, (await anon.GetAsync("/media/" + mediaId)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await anon.GetAsync("/api/public/content/" + cur.GetProperty("slug").GetString())).StatusCode);
    }

    [Fact]
    public async Task Publishing_requires_its_own_permission_and_moderator_approval_creates_only_a_draft()
    {
        await _h.CreateMember("mod@example.com", "Moderator");
        var mod = await _h.LoginAs("mod@example.com");
        var (code, _) = await Submit(_h.Anonymous(), NewPlace("Moderator test place"));
        var sub = await FindByCode(mod, code);
        Assert.Equal(HttpStatusCode.Forbidden, (await Approve(mod, sub, publish: true)).StatusCode);      // no content.publish
        Assert.Equal(HttpStatusCode.OK, (await Approve(mod, sub, publish: false)).StatusCode);
        Assert.Equal(0, await PublicTotal());
    }

    [Fact]
    public async Task Needs_correction_requires_a_note_and_the_contributor_can_resubmit_with_the_secret_token()
    {
        await _h.CreateMember("mod@example.com", "Admin");
        var admin = await _h.LoginAs("mod@example.com");
        var anon = _h.Anonymous();
        var (code, token) = await Submit(anon, NewPlace("Needs correction place"));
        var sub = await FindByCode(admin, code);

        Assert.Equal(HttpStatusCode.BadRequest, (await Status(admin, sub, "NeedsCorrection", null)).StatusCode);   // note required
        Assert.Equal(HttpStatusCode.OK, (await Status(admin, sub, "UnderReview", null)).StatusCode);
        sub = await FindByCode(admin, code);
        Assert.Equal(HttpStatusCode.OK, (await Status(admin, sub, "NeedsCorrection", "Please add the exact location.")).StatusCode);

        var track = await Json(await anon.GetAsync("/api/public/submissions/" + code));
        Assert.Equal("NeedsCorrection", track.GetProperty("status").GetString());
        Assert.Equal("Please add the exact location.", track.GetProperty("publicNote").GetString());
        Assert.True(track.GetProperty("canEdit").GetBoolean());

        var fixedFields = JsonSerializer.Serialize(new { type = "Place", titleEn = "Needs correction place", upazilaId = "khaliajuri", addressEn = "Near the ghat" });
        HttpRequestMessage Put(string tok) => new(HttpMethod.Put, "/api/public/submissions/" + code)
        { Content = new MultipartFormDataContent { { new StringContent(fixedFields), "payload" }, { new StringContent(tok), "editToken" } } };
        Assert.Equal(HttpStatusCode.NotFound, (await anon.SendAsync(Put("wrong-token"))).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await anon.SendAsync(Put(token))).StatusCode);

        sub = await FindByCode(admin, code);
        Assert.Equal("Pending", sub.GetProperty("status").GetString());
        var hist = sub.GetProperty("history").EnumerateArray().Select(e => e.GetProperty("to").GetString()).ToList();
        Assert.Equal(new[] { "Pending", "UnderReview", "NeedsCorrection", "Pending" }, hist);          // full review history
    }

    [Fact]
    public async Task Reject_needs_a_note_terminal_states_and_stale_versions_are_refused()
    {
        await _h.CreateMember("mod@example.com", "Admin");
        var admin = await _h.LoginAs("mod@example.com");
        var (code, _) = await Submit(_h.Anonymous(), NewPlace("Rejected place"));
        var sub = await FindByCode(admin, code);

        Assert.Equal(HttpStatusCode.BadRequest, (await Status(admin, sub, "Rejected", " ")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await Status(admin, sub, "Rejected", "Not a real place.")).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await Status(admin, sub, "UnderReview", null)).StatusCode);          // stale version
        var fresh = await FindByCode(admin, code);
        Assert.Equal(HttpStatusCode.Conflict, (await Approve(admin, fresh, true)).StatusCode);                        // Rejected -> Approved not allowed
        Assert.Equal(0, await PublicTotal());
        var track = await Json(await _h.Anonymous().GetAsync("/api/public/submissions/" + code));
        Assert.Equal("Not a real place.", track.GetProperty("publicNote").GetString());
    }

    [Fact]
    public async Task Duplicates_are_flagged_for_the_reviewer_and_identical_resends_are_blocked()
    {
        await _h.CreateMember("mod@example.com", "Admin");
        var admin = await _h.LoginAs("mod@example.com");
        var anon = _h.Anonymous();
        var (c1, _) = await Submit(anon, NewPlace("Netrokona Government College"));
        var s1 = await FindByCode(admin, c1);
        Assert.Equal(HttpStatusCode.OK, (await Approve(admin, s1, publish: true)).StatusCode);

        var (c2, _) = await Submit(anon, NewPlace("Netrokona Govt Colege", "other@example.com"));          // typo'd re-submission, different client text
        var s2 = await FindByCode(admin, c2);
        Assert.True(s2.GetProperty("duplicateScore").GetDouble() >= 0.8);
        Assert.Equal("Netrokona Government College", s2.GetProperty("duplicateContent").GetProperty("titleEn").GetString());
        var flagged = await Json(await admin.GetAsync("/api/admin/submissions?duplicates=true"));
        Assert.Equal(1, flagged.GetProperty("total").GetInt32());

        var again = await anon.PostAsync("/api/public/submissions", SubmissionForm(NewPlace("Netrokona Govt Colege")));
        Assert.Equal(HttpStatusCode.Conflict, again.StatusCode);                                              // exact re-send blocked
    }

    [Fact]
    public async Task Correction_applies_only_the_supplied_fields_and_is_audited_with_a_diff()
    {
        await _h.CreateMember("mod@example.com", "Admin");
        var admin = await _h.LoginAs("mod@example.com");
        var anon = _h.Anonymous();
        var (c1, _) = await Submit(anon, new
        {
            fields = new { type = "HealthFacility", titleEn = "Kalmakanda Health Complex", phone = "01700-000000", upazilaId = "kalmakanda" },
            submitter = new { name = "Admin seed", email = (string?)null, phone = (string?)null, message = "seed" },
        });
        var s1 = await FindByCode(admin, c1);
        await Approve(admin, s1, publish: true);
        var contentId = (await FindByCode(admin, c1)).GetProperty("resultContentId").GetString()!;

        var corr = await Submit(anon, new
        {
            fields = new { type = "HealthFacility", phone = "01711-111111" },
            submitter = new { name = "Karim", email = (string?)null, phone = (string?)null, message = "The phone number changed." },
            targetContentId = contentId,
        });
        var s2 = await FindByCode(admin, corr.Code);
        Assert.Equal("Correction", s2.GetProperty("kind").GetString());
        Assert.Equal(HttpStatusCode.OK, (await Approve(admin, s2, publish: false)).StatusCode);

        var pub = await Json(await anon.GetAsync("/api/public/content/kalmakanda-health-complex"));
        Assert.Equal("01711-111111", pub.GetProperty("phone").GetString());
        Assert.Equal("Kalmakanda Health Complex", pub.GetProperty("titleEn").GetString());                   // untouched

        var audit = await Json(await admin.GetAsync("/api/admin/audit?entityType=Content&entityId=" + contentId));
        var corrRow = audit.GetProperty("items").EnumerateArray().First(a => a.GetProperty("action").GetString() == "content.correct");
        Assert.Contains("01700-000000", corrRow.GetProperty("details").GetString());
        Assert.Equal("Test mod@example.com", corrRow.GetProperty("user").GetString());                       // name resolved from the SHARED db
    }

    [Fact]
    public async Task Upload_security_rejects_disguised_oversized_and_wrong_type_files_and_strips_the_client_name()
    {
        var anon = _h.Anonymous();
        async Task<(HttpStatusCode, string)> Try(string name, byte[] bytes)
        {
            var r = await anon.PostAsync("/api/public/submissions", SubmissionForm(NewPlace("Upload test " + name + bytes.Length, "x@example.com"), (name, bytes)));
            return (r.StatusCode, await r.Content.ReadAsStringAsync());
        }
        var exe = System.Text.Encoding.ASCII.GetBytes("MZ" + new string('A', 4000));
        Assert.Equal(HttpStatusCode.BadRequest, (await Try("evil.png", exe)).Item1);                         // not an image despite .png
        Assert.Equal(HttpStatusCode.BadRequest, (await Try("anim.gif", Png())).Item1);                       // extension not allowed
        Assert.Equal(HttpStatusCode.BadRequest, (await Try("../../evil.png", exe)).Item1);
        var big = new byte[6 * 1024 * 1024]; Png().CopyTo(big, 0);
        Assert.Equal(HttpStatusCode.BadRequest, (await Try("big.png", big)).Item1);                          // > 5 MB
        Assert.Equal(HttpStatusCode.BadRequest, (await Try("tiny.png", Png(20, 20))).Item1);                 // < 100 px

        var ok = await Try("../../holiday photo.PNG", Png());                                               // path-ish name is just a label
        Assert.Equal(HttpStatusCode.Created, ok.Item1);
        var uploads = Directory.GetFiles(Path.Combine(Path.GetDirectoryName(_h.NetrokonaDb)!, "uploads"));
        Assert.Single(uploads);
        Assert.Matches("^[0-9a-f]{32}\\.jpg$", Path.GetFileName(uploads[0]));                               // random server-side name, re-encoded JPEG
        Assert.True(File.ReadAllBytes(uploads[0]).Take(3).SequenceEqual(new byte[] { 0xFF, 0xD8, 0xFF }));
    }

    [Fact]
    public async Task Markup_and_invalid_fields_are_rejected()
    {
        var anon = _h.Anonymous();
        var r = await anon.PostAsync("/api/public/submissions", SubmissionForm(new
        {
            fields = new { type = "Place", titleEn = "<script>alert(1)</script>", upazilaId = "mars", latitude = 5.0, longitude = 91.0, website = "javascript:alert(1)" },
            submitter = new { name = "x", email = "not-an-email", phone = (string?)null, message = (string?)null },
        }));
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
        var errors = (await Json(r)).GetProperty("errors");
        foreach (var key in new[] { "titleEn", "upazilaId", "latitude", "website", "submitter.email", "submitter.name" })
            Assert.True(errors.TryGetProperty(key, out _), "missing error for " + key);
    }

    [Fact]
    public async Task Admin_content_crud_roles_concurrency_and_audit()
    {
        await _h.CreateMember("ed@example.com", "Editor");
        await _h.CreateMember("adm@example.com", "Admin");
        var ed = await _h.LoginAs("ed@example.com");
        var adm = await _h.LoginAs("adm@example.com");

        var created = await ed.PostAsJsonAsync("/api/admin/content", new { fields = new { type = "Institution", titleEn = "Test Model School", titleBn = "টেস্ট মডেল স্কুল", upazilaId = "madan" } });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var c = await Json(created);
        var id = c.GetProperty("id").GetString();
        Assert.Equal("Draft", c.GetProperty("publishState").GetString());
        Assert.Equal(0, await PublicTotal());

        Assert.Equal(HttpStatusCode.Forbidden, (await ed.PostAsJsonAsync($"/api/admin/content/{id}/state", new { state = "Published", version = 1 })).StatusCode);   // Editor can't publish
        Assert.Equal(HttpStatusCode.Forbidden, (await ed.DeleteAsync("/api/admin/content/" + id)).StatusCode);

        var fields = new { type = "Institution", titleEn = "Test Model School", titleBn = "টেস্ট মডেল স্কুল", upazilaId = "madan", summaryEn = "Updated" };
        Assert.Equal(HttpStatusCode.OK, (await ed.PutAsJsonAsync("/api/admin/content/" + id, new { fields, version = 1 })).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await adm.PutAsJsonAsync("/api/admin/content/" + id, new { fields, version = 1 })).StatusCode);   // stale

        var pub = await adm.PostAsJsonAsync($"/api/admin/content/{id}/state", new { state = "Published", version = 2 });
        Assert.Equal(HttpStatusCode.OK, pub.StatusCode);
        Assert.Equal(1, await PublicTotal("?type=Institution&upazila=madan"));
        Assert.Equal(0, await PublicTotal("?type=Place"));
        Assert.Equal(1, await PublicTotal("?q=" + Uri.EscapeDataString("টেস্ট")));                                                              // Bengali search

        Assert.Equal(HttpStatusCode.NoContent, (await adm.DeleteAsync("/api/admin/content/" + id)).StatusCode);
        Assert.Equal(0, await PublicTotal());

        var audit = await Json(await adm.GetAsync("/api/admin/audit?entityType=Content&entityId=" + id));
        var actions = audit.GetProperty("items").EnumerateArray().Select(a => a.GetProperty("action").GetString()).ToList();
        Assert.Contains("content.create", actions); Assert.Contains("content.update", actions);
        Assert.Contains("content.published", actions); Assert.Contains("content.delete", actions);
    }

    [Fact]
    public async Task Superadmin_manages_members_of_this_application_without_creating_or_duplicating_accounts()
    {
        var boss = await _h.CreateMember("boss@example.com", "SuperAdmin");
        var target = await _h.CreateGlobalUser("target@example.com");
        await _h.CreateMember("adm@example.com", "Admin");
        var before = await _h.CountGlobalUsers();
        var bossC = await _h.LoginAs("boss@example.com");
        var admC = await _h.LoginAs("adm@example.com");

        Assert.Equal(HttpStatusCode.Forbidden, (await admC.GetAsync("/api/admin/members")).StatusCode);          // Admin is not SuperAdmin
        Assert.Equal(HttpStatusCode.NotFound, (await bossC.GetAsync("/api/admin/members/lookup?email=ghost@example.com")).StatusCode);
        var look = await Json(await bossC.GetAsync("/api/admin/members/lookup?email=TARGET@example.com"));
        Assert.False(look.GetProperty("isMember").GetBoolean());

        var a1 = await Json(await bossC.PostAsJsonAsync("/api/admin/members", new { userId = target.Id }));
        var a2 = await Json(await bossC.PostAsJsonAsync("/api/admin/members", new { userId = target.Id }));
        Assert.True(a1.GetProperty("assigned").GetBoolean());
        Assert.False(a2.GetProperty("assigned").GetBoolean());                                                  // no duplicate
        Assert.Equal(HttpStatusCode.NotFound, (await bossC.PostAsJsonAsync("/api/admin/members", new { userId = Guid.NewGuid() })).StatusCode);
        Assert.Equal(before, await _h.CountGlobalUsers());                                                      // no account was created

        Assert.Equal(HttpStatusCode.NoContent, (await bossC.PutAsJsonAsync($"/api/admin/members/{target.Id}/roles", new { roles = new[] { "Editor" } })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await bossC.PutAsJsonAsync($"/api/admin/members/{target.Id}/roles", new { roles = new[] { "BillingAdmin" } })).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await bossC.PutAsJsonAsync($"/api/admin/members/{boss.Id}/roles", new { roles = new[] { "Editor" } })).StatusCode);   // last SuperAdmin
        Assert.Equal(HttpStatusCode.Conflict, (await bossC.DeleteAsync($"/api/admin/members/{boss.Id}")).StatusCode);

        var roles = await Json(await bossC.GetAsync("/api/admin/members/roles"));
        Assert.Contains("members.manage", roles.GetProperty("permissions").EnumerateArray().Select(x => x.GetString()));
        Assert.Equal(HttpStatusCode.NoContent, (await bossC.PutAsJsonAsync("/api/admin/members/roles/Editor/permissions", new { permissions = new[] { "content.view", "content.edit" } })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await bossC.PutAsJsonAsync("/api/admin/members/roles/Editor/permissions", new { permissions = new[] { "orders.view" } })).StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, (await bossC.PutAsJsonAsync("/api/admin/members/roles/SuperAdmin/permissions", new { permissions = new[] { "content.view" } })).StatusCode);
    }
}

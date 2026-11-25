using System.Net;
using System.Net.Http.Json;
using static NetrokonaCms.Tests.Host;

namespace NetrokonaCms.Tests;

public class CommentTests : IDisposable
{
    private readonly Host _h = new();
    public void Dispose() => _h.Dispose();

    private const string Page = "/upazilas/kalmakanda";

    private async Task<int> PublicCount(string page = Page) =>
        (await Json(await _h.Anonymous().GetAsync("/api/public/comments?page=" + Uri.EscapeDataString(page)))).GetProperty("items").GetArrayLength();

    private static async Task<string> FirstPendingId(HttpClient admin) =>
        (await Json(await admin.GetAsync("/api/admin/comments?status=Pending"))).GetProperty("items")[0].GetProperty("id").GetString()!;

    [Fact]
    public async Task Comment_is_hidden_until_a_moderator_approves_it()
    {
        await _h.CreateMember("mod@example.com", "Moderator");
        var admin = await _h.LoginAs("mod@example.com");
        var anon = _h.Anonymous();

        var r = await anon.PostAsJsonAsync("/api/public/comments", new { page = "/Upazilas/Kalmakanda/", name = "Rahim", body = "Great page!" });
        Assert.Equal(HttpStatusCode.Accepted, r.StatusCode);
        Assert.Equal(0, await PublicCount());                       // pending: not public

        var id = await FirstPendingId(admin);
        Assert.Equal(HttpStatusCode.NoContent, (await admin.PostAsync($"/api/admin/comments/{id}/approve", null)).StatusCode);
        var list = await Json(await anon.GetAsync("/api/public/comments?page=" + Page));
        Assert.Equal("Great page!", list.GetProperty("items")[0].GetProperty("body").GetString());
        Assert.Equal(0, await PublicCount("/upazilas/durgapur"));    // scoped to its own page

        Assert.Equal(HttpStatusCode.NoContent, (await admin.PostAsync($"/api/admin/comments/{id}/reject", null)).StatusCode);
        Assert.Equal(0, await PublicCount());
    }

    [Fact]
    public async Task Invalid_markup_duplicate_and_honeypot_comments_are_not_stored()
    {
        using var h = new Host(new() { ["RateLimiting:CommentPer10Minutes"] = "50" });
        await h.CreateMember("mod@example.com", "Moderator");
        var admin = await h.LoginAs("mod@example.com");
        var anon = h.Anonymous();

        Assert.Equal(HttpStatusCode.BadRequest, (await anon.PostAsJsonAsync("/api/public/comments", new { page = "https://evil.example", name = "Rahim", body = "hello" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Rahim", body = "<script>alert(1)</script>" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "R", body = "x" })).StatusCode);

        Assert.Equal(HttpStatusCode.Accepted, (await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Bot", body = "buy now", website = "spam.example" })).StatusCode);
        Assert.Equal(0, (await Json(await admin.GetAsync("/api/admin/comments"))).GetProperty("total").GetInt32());   // honeypot discarded

        Assert.Equal(HttpStatusCode.Accepted, (await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Rahim", body = "Once" })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Rahim", body = "Once" })).StatusCode);
    }

    [Fact]
    public async Task Only_staff_with_approve_permission_can_moderate()
    {
        await _h.CreateMember("editor@example.com", "Editor");
        var anon = _h.Anonymous();
        await anon.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Rahim", body = "Hello there" });

        Assert.Equal(HttpStatusCode.Unauthorized, (await anon.GetAsync("/api/admin/comments")).StatusCode);
        var editor = await _h.LoginAs("editor@example.com");                 // can view submissions, cannot approve
        var id = await FirstPendingId(editor);
        Assert.Equal(HttpStatusCode.Forbidden, (await editor.PostAsync($"/api/admin/comments/{id}/approve", null)).StatusCode);
        Assert.Equal(0, await PublicCount());
    }

    [Fact]
    public async Task Comments_are_rate_limited()
    {
        using var h = new Host(new() { ["RateLimiting:CommentPer10Minutes"] = "2" });
        var c = h.Anonymous();
        var codes = new List<HttpStatusCode>();
        for (var i = 0; i < 4; i++) codes.Add((await c.PostAsJsonAsync("/api/public/comments", new { page = Page, name = "Rahim", body = "Comment " + i })).StatusCode);
        Assert.Equal(2, codes.Count(x => x == HttpStatusCode.Accepted));
        Assert.Equal(2, codes.Count(x => x == HttpStatusCode.TooManyRequests));
    }
}

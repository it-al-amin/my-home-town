using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using NetrokonaCms.Api.Security;
using SharedIdentity.Core;
using static NetrokonaCms.Tests.Host;

namespace NetrokonaCms.Tests;

public class AuthTests : IDisposable
{
    private readonly Host _h = new();
    public void Dispose() => _h.Dispose();

    [Fact]
    public async Task Member_can_login_and_me_lists_this_applications_permissions_only()
    {
        await _h.CreateMember("ed@example.com", "Editor");
        var c = await _h.LoginAs("ed@example.com");
        var me = await Json(await c.GetAsync("/api/auth/me"));
        Assert.Contains("content.edit", me.GetProperty("permissions").EnumerateArray().Select(x => x.GetString()));
        Assert.DoesNotContain("members.manage", me.GetProperty("permissions").EnumerateArray().Select(x => x.GetString()));
        Assert.Equal("Editor", me.GetProperty("roles")[0].GetString());
    }

    [Fact]
    public async Task Unauthenticated_and_underprivileged_requests_are_blocked()
    {
        Assert.Equal(HttpStatusCode.Unauthorized, (await _h.Anonymous().GetAsync("/api/admin/content")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await _h.Anonymous().GetAsync("/api/admin/submissions")).StatusCode);
        await _h.CreateMember("ed@example.com", "Editor");
        var ed = await _h.LoginAs("ed@example.com");
        Assert.Equal(HttpStatusCode.Forbidden, (await ed.GetAsync("/api/admin/audit")).StatusCode);       // Editor has no audit.view
        Assert.Equal(HttpStatusCode.Forbidden, (await ed.GetAsync("/api/admin/members")).StatusCode);
    }

    [Fact]
    public async Task Failures_are_indistinguishable_and_global_user_without_membership_cannot_enter()
    {
        await _h.CreateGlobalUser("outsider@example.com");               // exists in the shared DB, NOT a Netrokona member
        await _h.CreateMember("ed@example.com", "Editor");
        var c = _h.Anonymous();
        var a = await c.PostAsJsonAsync("/api/auth/login", new { email = "outsider@example.com", password = Password });
        var b = await c.PostAsJsonAsync("/api/auth/login", new { email = "ed@example.com", password = "wrong" });
        var d = await c.PostAsJsonAsync("/api/auth/login", new { email = "nobody@example.com", password = Password });
        Assert.All(new[] { a, b, d }, r => Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode));
        Assert.Equal(await a.Content.ReadAsStringAsync(), await b.Content.ReadAsStringAsync());
        Assert.Equal(await b.Content.ReadAsStringAsync(), await d.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Unconfirmed_email_cannot_login()
    {
        var u = await _h.CreateGlobalUser("new@example.com", confirmed: false);
        using (var s = _h.Services.CreateScope())
            await s.ServiceProvider.GetRequiredService<ApplicationAccessService>().AssignUserAsync(NetrokonaApp.Key, u.Id, null);
        var r = await _h.Anonymous().PostAsJsonAsync("/api/auth/login", new { email = "new@example.com", password = Password });
        Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode);
    }

    [Fact]
    public async Task Superadmin_of_another_application_has_no_access_here()
    {
        var u = await _h.CreateGlobalUser("other@example.com");
        using (var s = _h.Services.CreateScope())
        {
            var acc = s.ServiceProvider.GetRequiredService<ApplicationAccessService>();
            await acc.EnsureApplicationAsync(new ApplicationDefinition("billing", "Billing", new[] { ("x", "x") }, new[] { new RoleDefinition("SuperAdmin", "all", new[] { "x" }) }));
            await acc.AssignUserAsync("billing", u.Id, null);
            await acc.SetUserRolesAsync("billing", u.Id, new[] { "SuperAdmin" }, null);
        }
        var r = await _h.Anonymous().PostAsJsonAsync("/api/auth/login", new { email = "other@example.com", password = Password });
        Assert.Equal(HttpStatusCode.Unauthorized, r.StatusCode);
    }

    [Fact]
    public async Task Mutations_without_the_csrf_header_are_rejected()
    {
        await _h.CreateMember("ed@example.com", "Editor");
        var c = await _h.LoginAs("ed@example.com");
        c.DefaultRequestHeaders.Remove("X-Requested-With");
        var r = await c.PostAsJsonAsync("/api/admin/content", new { fields = new { type = "Place", titleEn = "X place" } });
        Assert.Equal(HttpStatusCode.BadRequest, r.StatusCode);
    }

    [Fact]
    public async Task Netrokona_database_has_no_user_or_password_tables()
    {
        _ = _h.Anonymous();   // force startup (creates both databases)
        await using var conn = new SqliteConnection("Data Source=" + _h.NetrokonaDb + ";Mode=ReadOnly");
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "select name from sqlite_master where type='table'";
        var tables = new List<string>();
        await using (var rd = await cmd.ExecuteReaderAsync()) while (await rd.ReadAsync()) tables.Add(rd.GetString(0));
        Assert.DoesNotContain(tables, t => t.Contains("User", StringComparison.OrdinalIgnoreCase) || t.Contains("Role", StringComparison.OrdinalIgnoreCase) || t.Contains("Password", StringComparison.OrdinalIgnoreCase));
        Assert.Contains("Submissions", tables);
    }

    [Fact]
    public async Task Superadmin_revoking_membership_ends_the_session_immediately()
    {
        await _h.CreateMember("boss@example.com", "SuperAdmin");
        var ed = await _h.CreateMember("ed@example.com", "Editor");
        var edClient = await _h.LoginAs("ed@example.com");
        Assert.Equal(HttpStatusCode.OK, (await edClient.GetAsync("/api/admin/content")).StatusCode);
        // warm the (short) access cache, then revoke through the API
        var boss = await _h.LoginAs("boss@example.com");
        Assert.Equal(HttpStatusCode.NoContent, (await boss.DeleteAsync($"/api/admin/members/{ed.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await edClient.GetAsync("/api/admin/content")).StatusCode);
        Assert.Equal(1, await CountUsers(ed.Email));   // the global account still exists
    }

    private async Task<int> CountUsers(string email)
    {
        using var s = _h.Services.CreateScope();
        return (await s.ServiceProvider.GetRequiredService<IdentityService>().FindByEmailAsync(email)) is null ? 0 : 1;
    }
}

public class RateLimitTests
{
    [Fact]
    public async Task Login_is_rate_limited_per_client()
    {
        using var h = new Host(new() { ["RateLimiting:LoginPerMinute"] = "3" });
        var c = h.Anonymous();
        var codes = new List<HttpStatusCode>();
        for (var i = 0; i < 5; i++) codes.Add((await c.PostAsJsonAsync("/api/auth/login", new { email = "a@example.com", password = "x" })).StatusCode);
        Assert.Equal(3, codes.Count(x => x == HttpStatusCode.Unauthorized));
        Assert.Equal(2, codes.Count(x => x == HttpStatusCode.TooManyRequests));
    }

    [Fact]
    public async Task Submissions_are_rate_limited()
    {
        using var h = new Host(new() { ["RateLimiting:SubmitPerHour"] = "2" });
        var c = h.Anonymous();
        var codes = new List<HttpStatusCode>();
        for (var i = 0; i < 4; i++) codes.Add((await c.PostAsync("/api/public/submissions", SubmissionForm(NewPlace("Unique place number " + i)))).StatusCode);
        Assert.Equal(2, codes.Count(x => x == HttpStatusCode.Created));
        Assert.Equal(2, codes.Count(x => x == HttpStatusCode.TooManyRequests));
    }
}

public class SsoTests
{
    private const string Key = "unit-test-signing-key-0123456789-abcdef";

    [Fact]
    public async Task Bearer_token_for_this_app_works_and_token_for_another_app_is_rejected()
    {
        using var h = new Host(new() { ["Auth:Sso:Enabled"] = "true", ["Auth:Sso:SigningKey"] = Key });
        var u = await h.CreateMember("sso@example.com", "Editor");
        var outsider = await h.CreateGlobalUser("noapp@example.com");
        var tokens = new TokenService(new TokenOptions { SigningKey = Key });
        AppAccess Fake(User x) => new(x.Id, x.FullName, x.Email, x.SecurityStamp, new List<string>(), new HashSet<string>());

        HttpClient With(string t) { var c = h.Anonymous(); c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", t); return c; }
        var ok = await With(tokens.Issue("netrokona", Fake(new User { Id = u.Id, FullName = u.FullName, Email = u.Email, SecurityStamp = u.SecurityStamp }))).GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, ok.StatusCode);
        Assert.Contains("content.edit", (await Json(ok)).GetProperty("permissions").EnumerateArray().Select(x => x.GetString()));

        var wrongAudience = await With(tokens.Issue("other-app", Fake(new User { Id = u.Id, FullName = "x", Email = "x@x.com", SecurityStamp = u.SecurityStamp }))).GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, wrongAudience.StatusCode);

        var notMember = await With(tokens.Issue("netrokona", Fake(new User { Id = outsider.Id, FullName = "x", Email = "x@x.com", SecurityStamp = outsider.SecurityStamp }))).GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, notMember.StatusCode);   // valid token, but no Netrokona membership
    }
}

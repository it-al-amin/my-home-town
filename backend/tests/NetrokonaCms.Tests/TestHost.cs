using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetrokonaCms.Api.Security;
using SharedIdentity.Core;
using SkiaSharp;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace NetrokonaCms.Tests;

public class Host : WebApplicationFactory<Program>, IDisposable
{
    public const string Password = "Str0ng-Passw0rd";
    private readonly string _dir = Path.Combine(Path.GetTempPath(), "nk-test-" + Guid.NewGuid().ToString("N"));
    private readonly Dictionary<string, string?> _extra;

    public Host(Dictionary<string, string?>? extra = null)
    {
        _extra = extra ?? new();
        Directory.CreateDirectory(_dir);
    }

    public string NetrokonaDb => Path.Combine(_dir, "netrokona.db");
    public string SharedDb => Path.Combine(_dir, "shared.db");

    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, c) =>
        {
            var d = new Dictionary<string, string?>
            {
                ["Database:Provider"] = "Sqlite",
                ["ConnectionStrings:Netrokona"] = "Data Source=" + NetrokonaDb,
                ["ConnectionStrings:SharedIdentity"] = "Data Source=" + SharedDb,
                ["Uploads:Path"] = Path.Combine(_dir, "uploads"),
                ["RateLimiting:LoginPerMinute"] = "1000", ["RateLimiting:SubmitPerHour"] = "1000", ["RateLimiting:TrackPerMinute"] = "1000",
                ["Security:IpHashKey"] = "test-key",
            };
            foreach (var kv in _extra) d[kv.Key] = kv.Value;
            c.AddInMemoryCollection(d);
        });
    }

    public new void Dispose()
    {
        base.Dispose();
        try { Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools(); Directory.Delete(_dir, true); } catch { /* best effort */ }
    }

    // ---- shared-identity helpers (users are created in the SHARED database, as central tooling would) ----
    public async Task<User> CreateGlobalUser(string email, bool confirmed = true)
    {
        using var s = Services.CreateScope();
        return await s.ServiceProvider.GetRequiredService<IdentityService>().CreateUserAsync("Test " + email, email, Password, emailConfirmed: confirmed);
    }

    public async Task<User> CreateMember(string email, params string[] roles)
    {
        var u = await CreateGlobalUser(email);
        using var s = Services.CreateScope();
        var acc = s.ServiceProvider.GetRequiredService<ApplicationAccessService>();
        await acc.AssignUserAsync(NetrokonaApp.Key, u.Id, null);
        if (roles.Length > 0) await acc.SetUserRolesAsync(NetrokonaApp.Key, u.Id, roles, null);
        return u;
    }

    public async Task<int> CountGlobalUsers()
    {
        using var s = Services.CreateScope();
        return await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.CountAsync(s.ServiceProvider.GetRequiredService<SharedIdentityDbContext>().Users);
    }

    public HttpClient Anonymous()
    {
        var c = CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true, AllowAutoRedirect = false });
        c.DefaultRequestHeaders.Add("X-Requested-With", "NetrokonaWeb");
        return c;
    }

    public async Task<HttpClient> LoginAs(string email, string password = Password)
    {
        var c = Anonymous();
        var r = await c.PostAsJsonAsync("/api/auth/login", new { email, password });
        r.EnsureSuccessStatusCode();
        return c;
    }

    public static byte[] Png(int w = 200, int h = 160, byte seed = 1)
    {
        using var bmp = new SKBitmap(w, h);
        using (var cv = new SKCanvas(bmp)) { cv.Clear(new SKColor(seed, 120, 200)); cv.DrawCircle(w / 2, h / 2, Math.Min(w, h) / 3, new SKPaint { Color = SKColors.Yellow }); }
        using var img = SKImage.FromBitmap(bmp);
        return img.Encode(SKEncodedImageFormat.Png, 100).ToArray();
    }

    public static MultipartFormDataContent SubmissionForm(object payload, params (string name, byte[] bytes)[] images)
    {
        var f = new MultipartFormDataContent { { new StringContent(JsonSerializer.Serialize(payload, new JsonSerializerOptions(JsonSerializerDefaults.Web))), "payload" } };
        foreach (var (name, bytes) in images)
        {
            var part = new ByteArrayContent(bytes);
            part.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            f.Add(part, "images", name);
        }
        return f;
    }

    public static object NewPlace(string title = "Dingapota Haor Viewpoint", string email = "visitor@example.com", object? extra = null) => new
    {
        fields = new { type = "Place", titleEn = title, summaryEn = "A scenic viewpoint over the haor.", upazilaId = "khaliajuri", latitude = 24.9, longitude = 91.0 },
        submitter = new { name = "Rahim", email, phone = (string?)null, message = "Visited last week" },
        targetContentId = extra,
    };

    public static async Task<JsonElement> Json(HttpResponseMessage r) =>
        JsonDocument.Parse(await r.Content.ReadAsStringAsync()).RootElement.Clone();
}

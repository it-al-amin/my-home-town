using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Security;
using NetrokonaCms.Api.Services;
using SharedIdentity.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = 31_000_000);
builder.WebHost.ConfigureKestrel(k => k.Limits.MaxRequestBodySize = 31_000_000);
builder.Services.AddHttpContextAccessor();

// --- two separate databases: shared identity (users/apps/roles/permissions) and this application's business data
// (settings are resolved lazily from the final IConfiguration, so every config source/override is honoured)
builder.Services.AddDbContext<NetrokonaDbContext>((sp, o) =>
{
    var c = sp.GetRequiredService<IConfiguration>();
    var cs = c.GetConnectionString("Netrokona") ?? throw new InvalidOperationException("ConnectionStrings:Netrokona is not configured.");
    if ((c["Database:Provider"] ?? "MySql").Equals("Sqlite", StringComparison.OrdinalIgnoreCase)) o.UseSqlite(cs);
    else o.UseMySql(cs, new MySqlServerVersion(new Version(8, 0, 36)));
});
builder.Services.AddSharedIdentity(sp =>
{
    var c = sp.GetRequiredService<IConfiguration>();
    return (c.GetConnectionString("SharedIdentity") ?? throw new InvalidOperationException("ConnectionStrings:SharedIdentity is not configured."),
            c["Database:Provider"] ?? "MySql", o => o.RequireConfirmedEmail = c.GetValue("Auth:RequireConfirmedEmail", true));
});

builder.Services.AddNetrokonaAuth(builder.Environment);

builder.Services.AddSingleton(sp => sp.GetRequiredService<IConfiguration>().GetSection("Security").Get<SecurityOptions>() ?? new SecurityOptions());
builder.Services.AddSingleton(sp => sp.GetRequiredService<IConfiguration>().GetSection("Uploads").Get<UploadOptions>() ?? new UploadOptions());
builder.Services.AddSingleton(sp => sp.GetRequiredService<IConfiguration>().GetSection("Submissions").Get<SubmissionOptions>() ?? new SubmissionOptions());
builder.Services.AddScoped<RequestInfo>();
builder.Services.AddScoped<AuditService>();
builder.Services.AddScoped<DuplicateDetector>();
builder.Services.AddScoped<UploadService>();
builder.Services.AddScoped<ContentService>();
builder.Services.AddScoped<SubmissionService>();

// --- rate limiting (per client IP)
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    void Add(string name, string key, int def, TimeSpan window) =>
        o.AddPolicy(name, ctx =>
        {
            var limit = ctx.RequestServices.GetRequiredService<IConfiguration>().GetValue($"RateLimiting:{key}", def);
            return RateLimitPartition.GetFixedWindowLimiter(ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = limit, Window = window, QueueLimit = 0 });
        });
    Add("login", "LoginPerMinute", 5, TimeSpan.FromMinutes(1));
    Add("submit", "SubmitPerHour", 10, TimeSpan.FromHours(1));
    Add("track", "TrackPerMinute", 20, TimeSpan.FromMinutes(1));
    Add("public-read", "PublicReadPerMinute", 240, TimeSpan.FromMinutes(1));
});

var app = builder.Build();

if (app.Configuration.GetValue("Proxy:Enabled", false))   // behind nginx/IIS: trust X-Forwarded-For for rate limiting and IP hashing
    app.UseForwardedHeaders(new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto });

// --- error mapping
app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (ApiException e)
    {
        ctx.Response.StatusCode = e.Status;
        await ctx.Response.WriteAsJsonAsync(new { message = e.Message, errors = e.Errors });
    }
    catch (DbUpdateConcurrencyException)
    {
        ctx.Response.StatusCode = 409;
        await ctx.Response.WriteAsJsonAsync(new { message = "The record was changed by someone else. Reload and try again." });
    }
});

// --- security headers
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"] = "DENY";
    h["Referrer-Policy"] = "no-referrer";
    if (!ctx.Response.Headers.ContainsKey("Content-Security-Policy")) h["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";
    await next();
});
if (app.Environment.IsProduction()) app.UseHsts();

// --- CSRF defence for cookie-authenticated mutations: SameSite=Strict cookie + a custom header that a cross-site
//     form/page cannot send (CORS is not enabled). Bearer (SSO) requests carry no ambient credentials and are exempt.
app.Use(async (ctx, next) =>
{
    var m = ctx.Request.Method;
    var guarded = ctx.Request.Path.StartsWithSegments("/api/admin") || ctx.Request.Path.StartsWithSegments("/api/auth");
    if (guarded && !(HttpMethods.IsGet(m) || HttpMethods.IsHead(m) || HttpMethods.IsOptions(m))
        && !ctx.Request.Headers.Authorization.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
        && ctx.Request.Headers["X-Requested-With"] != "NetrokonaWeb")
    {
        ctx.Response.StatusCode = 400;
        await ctx.Response.WriteAsJsonAsync(new { message = "Missing X-Requested-With header." });
        return;
    }
    await next();
});

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

await Initializer.RunAsync(app.Services, app.Configuration, app.Configuration["Database:Provider"] ?? "MySql", app.Logger);
app.Run();

public partial class Program { }

/// <summary>Idempotent startup: prepare databases, register this application (permissions + roles) in the shared
/// identity database, and optionally grant SuperAdmin to an EXISTING global user. It never creates user accounts.</summary>
public static class Initializer
{
    public static async Task RunAsync(IServiceProvider sp, IConfiguration cfg, string provider, ILogger log)
    {
        if (cfg.GetValue("Auth:Sso:Enabled", false) && (cfg["Auth:Sso:SigningKey"] ?? "").Length < 32)
            throw new InvalidOperationException("Auth:Sso:SigningKey must be at least 32 characters when SSO is enabled.");
        using var scope = sp.CreateScope();
        var shared = scope.ServiceProvider.GetRequiredService<SharedIdentityDbContext>();
        var db = scope.ServiceProvider.GetRequiredService<NetrokonaDbContext>();
        var sqlite = provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase);

        if (sqlite) { await shared.Database.EnsureCreatedAsync(); await db.Database.EnsureCreatedAsync(); }
        else
        {
            // Schema changes of the SHARED database are owned by the identity project (`SharedIdentity.Cli migrate`);
            // the flag below is a development convenience only.
            if (cfg.GetValue("Database:MigrateSharedIdentity", false)) await shared.Database.MigrateAsync();
            if (cfg.GetValue("Database:MigrateOnStartup", false)) await db.Database.MigrateAsync();
        }

        var access = scope.ServiceProvider.GetRequiredService<ApplicationAccessService>();
        await access.EnsureApplicationAsync(NetrokonaApp.Definition);

        var email = cfg["Bootstrap:SuperAdminEmail"];
        if (string.IsNullOrWhiteSpace(email)) return;
        var members = await access.ListMembersAsync(NetrokonaApp.Key);
        if (members.Any(m => m.MembershipActive && m.Roles.Contains("SuperAdmin"))) return;
        var ids = scope.ServiceProvider.GetRequiredService<IdentityService>();
        var user = await ids.FindByEmailAsync(email);
        if (user is null)
        {
            log.LogWarning("Bootstrap:SuperAdminEmail {Email} has no global account. Create it in the central identity system " +
                           "(SharedIdentity.Cli create-user) - this application never creates user accounts.", email);
            return;
        }
        await access.AssignUserAsync(NetrokonaApp.Key, user.Id, null);
        await access.SetUserRolesAsync(NetrokonaApp.Key, user.Id, new[] { "SuperAdmin" }, null);
        log.LogInformation("Granted Netrokona SuperAdmin to existing global user {Email}.", email);
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SharedIdentity.Core;

namespace NetrokonaCms.Api.Security;

public class SsoOptions
{
    public bool Enabled { get; set; }
    public string Issuer { get; set; } = "shared-identity";
    public string SigningKey { get; set; } = "";
}

/// <summary>Turns an authenticated shared-identity user id into THIS application's roles and permissions.
/// Used for both the local cookie and future SSO bearer tokens, so there is a single authorization path.
/// Loaded from the shared database on a short cache, so revoking membership/roles takes effect within seconds.</summary>
public class AccessLoader
{
    private readonly ApplicationAccessService _access;
    private readonly IMemoryCache _cache;
    public AccessLoader(ApplicationAccessService access, IMemoryCache cache) { _access = access; _cache = cache; }

    public async Task<AppAccess?> LoadAsync(Guid userId, CancellationToken ct = default)
    {
        if (_cache.TryGetValue(userId, out AppAccess? hit)) return hit;
        var acc = await _access.GetAccessAsync(NetrokonaApp.Key, userId, ct);
        _cache.Set(userId, acc, TimeSpan.FromSeconds(20));
        return acc;
    }

    public void Invalidate(Guid userId) => _cache.Remove(userId);

    /// <summary>Rebuilds the principal's claims from the shared tables, or returns false if the user may no longer enter.</summary>
    public async Task<bool> ApplyAsync(ClaimsPrincipal principal, string? expectedStamp, CancellationToken ct = default)
    {
        var sub = principal.FindFirstValue("sub") ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var userId)) return false;
        var acc = await LoadAsync(userId, ct);
        if (acc is null) return false;
        if (expectedStamp != null && expectedStamp != acc.SecurityStamp) return false;   // password changed / forced sign-out
        if (principal.Identity is not ClaimsIdentity id) return false;
        foreach (var c in id.FindAll(c => c.Type is ClaimTypes.Role or "perm" or "name_full" or ClaimTypes.Email).ToList()) id.RemoveClaim(c);
        id.AddClaim(new Claim("name_full", acc.FullName));
        id.AddClaim(new Claim(ClaimTypes.Email, acc.Email));
        foreach (var r in acc.Roles) id.AddClaim(new Claim(ClaimTypes.Role, r));
        foreach (var p in acc.Permissions) id.AddClaim(new Claim("perm", p));
        return true;
    }
}

public static class CurrentUser
{
    public static Guid? Id(this ClaimsPrincipal u) =>
        Guid.TryParse(u.FindFirstValue("sub") ?? u.FindFirstValue(ClaimTypes.NameIdentifier), out var g) ? g : null;
}

public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }
    public PermissionRequirement(string p) => Permission = p;
}

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx, PermissionRequirement r)
    {
        if (ctx.User.HasClaim("perm", r.Permission)) ctx.Succeed(r);
        return Task.CompletedTask;
    }
}

/// <summary>[Authorize(Policy = "perm:content.edit")] works for any permission key without registering each one.</summary>
public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public PermissionPolicyProvider(IOptions<AuthorizationOptions> o) : base(o) { }
    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string name)
    {
        if (name.StartsWith("perm:"))
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser().AddRequirements(new PermissionRequirement(name[5..])).Build();
        return await base.GetPolicyAsync(name);
    }
}

public static class AuthSetup
{
    public const string Cookie = "netrokona.auth";
    public const string StampClaim = "stamp";

    public static IServiceCollection AddNetrokonaAuth(this IServiceCollection services, IHostEnvironment env)
    {
        services.AddMemoryCache();
        services.AddScoped<AccessLoader>();
        services.AddSingleton<IAuthorizationHandler, PermissionHandler>();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();

        var auth = services.AddAuthentication(o =>
        {
            o.DefaultScheme = "smart";
            o.DefaultChallengeScheme = "smart";
        }).AddPolicyScheme("smart", "Cookie or Bearer", o =>
            o.ForwardDefaultSelector = ctx =>
                ctx.RequestServices.GetRequiredService<IConfiguration>().GetValue("Auth:Sso:Enabled", false)
                && ctx.Request.Headers.Authorization.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? JwtBearerDefaults.AuthenticationScheme : Cookie)
          .AddCookie(Cookie, o =>
        {
            o.Cookie.Name = Cookie;
            o.Cookie.HttpOnly = true;
            o.Cookie.SameSite = SameSiteMode.Strict;
            o.Cookie.SecurePolicy = env.IsProduction() ? CookieSecurePolicy.Always : CookieSecurePolicy.SameAsRequest;
            o.ExpireTimeSpan = TimeSpan.FromHours(8);
            o.SlidingExpiration = true;
            // API: never redirect to a login page
            o.Events.OnRedirectToLogin = c => { c.Response.StatusCode = 401; return Task.CompletedTask; };
            o.Events.OnRedirectToAccessDenied = c => { c.Response.StatusCode = 403; return Task.CompletedTask; };
            o.Events.OnValidatePrincipal = async c =>
            {
                var loader = c.HttpContext.RequestServices.GetRequiredService<AccessLoader>();
                var stamp = c.Principal?.FindFirstValue(StampClaim);
                if (c.Principal is null || !await loader.ApplyAsync(c.Principal, stamp))
                {
                    c.RejectPrincipal();
                    await c.HttpContext.SignOutAsync(Cookie);
                }
            };
        });

        // Registered always; only used when Auth:Sso:Enabled is true (see the scheme selector above).
        auth.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, _ => { });
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme).Configure<IConfiguration>((o, c) =>
        {
            var sso = c.GetSection("Auth:Sso").Get<SsoOptions>() ?? new SsoOptions();
            o.MapInboundClaims = false;
            if (sso.SigningKey.Length >= 32)
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = sso.Issuer,
                    ValidAudience = NetrokonaApp.Key,        // a token minted for another application is rejected
                    IssuerSigningKey = TokenService.Key(sso.SigningKey),
                    ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    NameClaimType = "name",
                };
            o.Events = new JwtBearerEvents
            {
                OnTokenValidated = async ctx =>
                {
                    var loader = ctx.HttpContext.RequestServices.GetRequiredService<AccessLoader>();
                    if (ctx.Principal is null || !await loader.ApplyAsync(ctx.Principal, ctx.Principal.FindFirstValue(StampClaim)))
                        ctx.Fail("User has no access to this application.");
                },
            };
        });
        services.AddAuthorization();
        return services;
    }
}

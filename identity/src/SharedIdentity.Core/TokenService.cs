using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SharedIdentity.Core;

public class TokenOptions
{
    public string Issuer { get; set; } = "shared-identity";
    public string SigningKey { get; set; } = "";   // >= 32 chars; supply from secrets/env, never commit
    public TimeSpan Lifetime { get; set; } = TimeSpan.FromMinutes(30);
}

/// <summary>Issues short-lived, application-audience JWTs. Foundation for future central login/SSO:
/// the token carries only identity (sub, name, email, stamp) and the audience; each application still
/// resolves its OWN roles/permissions from the shared tables, so a token for one app grants nothing in another.</summary>
public class TokenService
{
    private readonly TokenOptions _o;
    public TokenService(TokenOptions o)
    {
        if (o.SigningKey.Length < 32) throw new ArgumentException("SigningKey must be at least 32 characters.");
        _o = o;
    }

    public static SymmetricSecurityKey Key(string signingKey) => new(Encoding.UTF8.GetBytes(signingKey));

    public string Issue(string appKey, AppAccess a)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, a.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, a.Email),
            new Claim("name", a.FullName),
            new Claim("stamp", a.SecurityStamp),
        };
        var token = new JwtSecurityToken(_o.Issuer, appKey, claims, DateTime.UtcNow, DateTime.UtcNow + _o.Lifetime,
            new SigningCredentials(Key(_o.SigningKey), SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

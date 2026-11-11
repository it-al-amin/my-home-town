using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;
using NetrokonaCms.Api.Security;
using NetrokonaCms.Api.Services;
using SharedIdentity.Core;

namespace NetrokonaCms.Api.Controllers;

[ApiController, Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IdentityService _ids;
    private readonly ApplicationAccessService _access;
    private readonly AccessLoader _loader;
    private readonly NetrokonaDbContext _db;
    private readonly AuditService _audit;
    public AuthController(IdentityService ids, ApplicationAccessService access, AccessLoader loader, NetrokonaDbContext db, AuditService audit)
    { _ids = ids; _access = access; _loader = loader; _db = db; _audit = audit; }

    /// <summary>Verifies the credentials against the SHARED user table and requires membership of the Netrokona application.
    /// The cookie carries only the user id + security stamp; roles/permissions are loaded from the shared DB per request.</summary>
    [HttpPost("login"), EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginRequest r, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(r.Email) || string.IsNullOrEmpty(r.Password) || r.Password.Length > 200)
            return Unauthorized(new { message = "Invalid email or password." });
        var res = await _ids.AuthenticateAsync(NetrokonaApp.Key, r.Email, r.Password, _access, ct);
        // the specific reason is audited but never revealed to the client (no account enumeration)
        _audit.Add(res.Succeeded ? "auth.login" : "auth.login_failed", "Auth", res.Access?.UserId, res.Succeeded ? null : res.Failure.ToString(), res.Access?.UserId);
        await _db.SaveChangesAsync(ct);
        if (!res.Succeeded) return Unauthorized(new { message = "Invalid email or password, or no access to this application." });

        var a = res.Access!;
        _loader.Invalidate(a.UserId);
        var id = new ClaimsIdentity(new[] { new Claim("sub", a.UserId.ToString()), new Claim(AuthSetup.StampClaim, a.SecurityStamp) }, AuthSetup.Cookie, "name_full", ClaimTypes.Role);
        await HttpContext.SignInAsync(AuthSetup.Cookie, new ClaimsPrincipal(id), new AuthenticationProperties { IsPersistent = false });
        return Ok(new { id = a.UserId, name = a.FullName, email = a.Email, roles = a.Roles, permissions = a.Permissions.OrderBy(p => p) });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (User.Id() is { } uid) { _audit.Add("auth.logout", "Auth", uid); await _db.SaveChangesAsync(ct); _loader.Invalidate(uid); }
        await HttpContext.SignOutAsync(AuthSetup.Cookie);
        return NoContent();
    }

    [HttpGet("me"), Authorize]
    public IActionResult Me() => Ok(new
    {
        id = User.Id(), name = User.FindFirstValue("name_full"), email = User.FindFirstValue(ClaimTypes.Email),
        roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).OrderBy(x => x),
        permissions = User.FindAll("perm").Select(c => c.Value).OrderBy(x => x),
    });
}

[ApiController, Route("api/public")]
[EnableRateLimiting("public-read")]
public class PublicController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly ContentService _content;
    private readonly SubmissionService _subs;
    public PublicController(NetrokonaDbContext db, ContentService content, SubmissionService subs) { _db = db; _content = content; _subs = subs; }

    [HttpGet("meta")]
    public IActionResult Meta() => Ok(new
    {
        types = Enum.GetNames<ContentType>(), upazilas = FieldRules.Upazilas,
        limits = new { maxImages = 5, maxImageMb = 5 },
    });

    /// <summary>Only Published AND active content is ever returned here.</summary>
    [HttpGet("content")]
    public async Task<IActionResult> List([FromQuery] string? type, [FromQuery] string? upazila, [FromQuery] string? q,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 12, CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 50); page = Math.Max(1, page);
        var query = _content.PublicQuery();
        if (!string.IsNullOrWhiteSpace(type))
        {
            if (!Enum.TryParse<ContentType>(type, true, out var t)) return BadRequest(new { message = "Unknown type." });
            query = query.Where(c => c.Type == t);
        }
        if (!string.IsNullOrWhiteSpace(upazila)) query = query.Where(c => c.UpazilaId == upazila);
        if (!string.IsNullOrWhiteSpace(q)) { var n = q.Trim(); query = query.Where(c => c.TitleEn.Contains(n) || c.TitleBn.Contains(n) || (c.SummaryEn != null && c.SummaryEn.Contains(n)) || (c.SummaryBn != null && c.SummaryBn.Contains(n))); }
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(c => c.PublishedAtUtc).ThenBy(c => c.Id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        var ids = items.Select(i => i.Id).ToList();
        var media = await _db.Media.AsNoTracking().Where(m => m.ContentItemId != null && ids.Contains(m.ContentItemId.Value) && m.Status == MediaStatus.Approved).ToListAsync(ct);
        return Ok(new { total, page, pageSize, items = items.Select(i => ContentService.ToPublic(i, media.Where(m => m.ContentItemId == i.Id))) });
    }

    [HttpGet("content/{slug}")]
    public async Task<IActionResult> Get(string slug, CancellationToken ct)
    {
        var c = await _content.PublicQuery().FirstOrDefaultAsync(x => x.Slug == slug, ct);
        if (c is null) return NotFound(new { message = "Not found." });
        var media = await _db.Media.AsNoTracking().Where(m => m.ContentItemId == c.Id && m.Status == MediaStatus.Approved).ToListAsync(ct);
        return Ok(ContentService.ToPublic(c, media));
    }

    /// <summary>multipart/form-data: <c>payload</c> = JSON NewSubmissionRequest, <c>images</c> = 0..5 image files.
    /// Creates a Pending submission only. Nothing here can publish content.</summary>
    [HttpPost("submissions"), EnableRateLimiting("submit"), RequestSizeLimit(30_000_000)]
    public async Task<IActionResult> Submit([FromForm] string payload, [FromForm] List<IFormFile>? images, CancellationToken ct)
    {
        NewSubmissionRequest? req;
        try { req = JsonSerializer.Deserialize<NewSubmissionRequest>(payload ?? "", SubmissionOptions.Json); }
        catch (JsonException) { return BadRequest(new { message = "Invalid payload." }); }
        if (req?.Fields is null || req.Submitter is null) return BadRequest(new { message = "Invalid payload." });
        var (sub, token, warnings) = await _subs.CreateAsync(req, images ?? new List<IFormFile>(), ct);
        return Created($"/api/public/submissions/{sub.TrackingCode}", new
        {
            trackingCode = sub.TrackingCode, editToken = token, status = sub.Status.ToString(), warnings,
            message = "Thank you. Your submission is pending review and will not appear on the site until an administrator approves it.",
        });
    }

    [HttpGet("submissions/{code}"), EnableRateLimiting("track")]
    public async Task<IActionResult> Track(string code, CancellationToken ct) =>
        await _subs.PublicStatusAsync(code.Trim().ToUpperInvariant(), ct) is { } r ? Ok(r) : NotFound(new { message = "No submission with that code." });

    [HttpPut("submissions/{code}"), EnableRateLimiting("submit"), RequestSizeLimit(30_000_000)]
    public async Task<IActionResult> Resubmit(string code, [FromForm] string payload, [FromForm] string editToken, [FromForm] List<IFormFile>? images, CancellationToken ct)
    {
        ContentFields? fields;
        try { fields = JsonSerializer.Deserialize<ContentFields>(payload ?? "", SubmissionOptions.Json); }
        catch (JsonException) { return BadRequest(new { message = "Invalid payload." }); }
        if (fields is null) return BadRequest(new { message = "Invalid payload." });
        var s = await _subs.ResubmitAsync(code.Trim().ToUpperInvariant(), editToken, fields, null, images ?? new List<IFormFile>(), ct);
        return Ok(new { trackingCode = s.TrackingCode, status = s.Status.ToString() });
    }
}

/// <summary>Public image delivery: only Approved media that belongs to Published, active content. Files live outside wwwroot.</summary>
[ApiController]
public class MediaController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly UploadService _upload;
    public MediaController(NetrokonaDbContext db, UploadService upload) { _db = db; _upload = upload; }

    [HttpGet("media/{id:guid}"), EnableRateLimiting("public-read")]
    public async Task<IActionResult> Public(Guid id, CancellationToken ct)
    {
        var m = await _db.Media.AsNoTracking().Include(x => x.ContentItem).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (m is null || m.Status != MediaStatus.Approved || m.ContentItem is not { PublishState: PublishState.Published, IsActive: true })
            return NotFound();
        return Serve(m, "public, max-age=86400");
    }

    [HttpGet("api/admin/media/{id:guid}/file"), Authorize]
    public async Task<IActionResult> Admin(Guid id, CancellationToken ct)
    {
        if (!User.HasClaim("perm", NetrokonaApp.P.MediaManage) && !User.HasClaim("perm", NetrokonaApp.P.SubmissionsView)) return Forbid();
        var m = await _db.Media.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return m is null ? NotFound() : Serve(m, "private, no-store");
    }

    private IActionResult Serve(MediaAsset m, string cache)
    {
        var path = _upload.PathFor(m);
        if (!System.IO.File.Exists(path)) return NotFound();
        Response.Headers["X-Content-Type-Options"] = "nosniff";
        Response.Headers["Content-Security-Policy"] = "default-src 'none'; sandbox";
        Response.Headers["Cache-Control"] = cache;
        return PhysicalFile(path, "image/jpeg");      // always the re-encoded JPEG; never the client's declared type
    }
}

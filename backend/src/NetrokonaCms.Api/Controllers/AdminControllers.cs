using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;
using NetrokonaCms.Api.Security;
using NetrokonaCms.Api.Services;
using SharedIdentity.Core;
using P = NetrokonaCms.Api.Security.NetrokonaApp.P;

namespace NetrokonaCms.Api.Controllers;

// Everything under /api/admin requires an authenticated shared-identity user who is a member of THIS application,
// plus the specific permission on each action. Public visitors never reach these routes.

[ApiController, Route("api/admin/content")]
[Authorize(Policy = "perm:" + P.ContentView)]
public class AdminContentController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly ContentService _content;
    private readonly AuditService _audit;
    private readonly UploadService _upload;
    public AdminContentController(NetrokonaDbContext db, ContentService content, AuditService audit, UploadService upload)
    { _db = db; _content = content; _audit = audit; _upload = upload; }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? type, [FromQuery] string? state, [FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100); page = Math.Max(1, page);
        var query = _db.Content.AsNoTracking().AsQueryable();
        if (Enum.TryParse<ContentType>(type, true, out var t)) query = query.Where(c => c.Type == t);
        if (Enum.TryParse<PublishState>(state, true, out var st)) query = query.Where(c => c.PublishState == st);
        if (!string.IsNullOrWhiteSpace(q)) { var n = q.Trim(); query = query.Where(c => c.TitleEn.Contains(n) || c.TitleBn.Contains(n)); }
        var total = await query.CountAsync(ct);
        var items = await query.OrderByDescending(c => c.UpdatedAtUtc).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var c = await _db.Content.AsNoTracking().Include(x => x.Media).FirstOrDefaultAsync(x => x.Id == id, ct);
        return c is null ? NotFound() : Ok(c);
    }

    [HttpPost, Authorize(Policy = "perm:" + P.ContentCreate)]
    public async Task<IActionResult> Create(ContentWriteRequest r, CancellationToken ct)
    {
        FieldRules.Normalize(r.Fields);
        var errors = FieldRules.Validate(r.Fields);
        if (errors.Count > 0) return BadRequest(new { message = "Validation failed.", errors });
        var c = await _content.CreateAsync(r.Fields, User.Id()!.Value, null, publish: false, ct);
        if (r.IsActive is bool a) c.IsActive = a;
        _audit.Add("content.create", "Content", c.Id, $"type={c.Type} title={c.TitleEn}{c.TitleBn}");
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
    }

    [HttpPut("{id:guid}"), Authorize(Policy = "perm:" + P.ContentEdit)]
    public async Task<IActionResult> Update(Guid id, ContentWriteRequest r, CancellationToken ct)
    {
        var c = await _db.Content.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return NotFound();
        if (r.Version != c.Version) return Conflict(new { message = "This item was changed by someone else. Reload and try again." });
        FieldRules.Normalize(r.Fields);
        r.Fields.Type = c.Type;     // type is fixed after creation
        var errors = FieldRules.Validate(r.Fields);
        if (errors.Count > 0) return BadRequest(new { message = "Validation failed.", errors });
        var before = System.Text.Json.JsonSerializer.Serialize(new { c.TitleEn, c.TitleBn, c.SummaryEn, c.UpazilaId, c.Phone, c.Website });
        ContentService.ApplyAll(c, r.Fields);
        if (r.IsActive is bool a) c.IsActive = a;
        c.UpdatedBy = User.Id(); c.Version++;
        _audit.Add("content.update", "Content", c.Id, "before=" + before);
        await _db.SaveChangesAsync(ct);
        return Ok(c);
    }

    public record StateRequest(string State, int Version);

    [HttpPost("{id:guid}/state"), Authorize(Policy = "perm:" + P.ContentPublish)]
    public async Task<IActionResult> SetState(Guid id, StateRequest r, CancellationToken ct)
    {
        if (!Enum.TryParse<PublishState>(r.State, true, out var target)) return BadRequest(new { message = "State must be Draft, Published or Archived." });
        var c = await _db.Content.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return NotFound();
        if (r.Version != c.Version) return Conflict(new { message = "This item was changed by someone else. Reload and try again." });
        var from = c.PublishState;
        try { if (target == PublishState.Published) ContentService.Publish(c, User.Id()!.Value); else c.PublishState = target; }
        catch (InvalidOperationException e) { return BadRequest(new { message = e.Message }); }
        c.UpdatedBy = User.Id(); c.UpdatedAtUtc = DateTime.UtcNow; c.Version++;
        _audit.Add("content." + target.ToString().ToLowerInvariant(), "Content", c.Id, $"{from} -> {target}");
        await _db.SaveChangesAsync(ct);
        return Ok(c);
    }

    [HttpDelete("{id:guid}"), Authorize(Policy = "perm:" + P.ContentDelete)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var c = await _db.Content.Include(x => x.Media).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return NotFound();
        foreach (var m in c.Media) _upload.Delete(m);
        _db.Content.Remove(c);
        _audit.Add("content.delete", "Content", id, $"{c.Type} {c.TitleEn}{c.TitleBn}");
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}

[ApiController, Route("api/admin/media")]
[Authorize(Policy = "perm:" + P.MediaManage)]
public class AdminMediaController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly UploadService _upload;
    private readonly AuditService _audit;
    public AdminMediaController(NetrokonaDbContext db, UploadService upload, AuditService audit) { _db = db; _upload = upload; _audit = audit; }

    [HttpPost("content/{contentId:guid}"), RequestSizeLimit(30_000_000)]
    public async Task<IActionResult> Upload(Guid contentId, [FromForm] List<IFormFile> files, [FromForm] string? altEn, [FromForm] string? altBn, [FromForm] string? credit, CancellationToken ct)
    {
        var c = await _db.Content.FirstOrDefaultAsync(x => x.Id == contentId, ct);
        if (c is null) return NotFound();
        if (files.Count is 0 or > 5) return BadRequest(new { message = "Upload between 1 and 5 images." });
        var hasCover = await _db.Media.AnyAsync(m => m.ContentItemId == contentId && m.IsCover, ct);
        var made = new List<MediaAsset>();
        try
        {
            foreach (var f in files)
            {
                var m = await _upload.SaveAsync(f, User.Id(), ct);
                m.ContentItemId = contentId; m.Status = MediaStatus.Approved; m.AltEn = FieldRules.Clean(altEn); m.AltBn = FieldRules.Clean(altBn); m.Credit = FieldRules.Clean(credit);
                if (!hasCover) { m.IsCover = true; hasCover = true; }
                made.Add(m); _db.Media.Add(m);
            }
        }
        catch (UploadRejected e) { foreach (var m in made) _upload.Delete(m); return BadRequest(new { message = e.Message }); }
        _audit.Add("media.upload", "Content", contentId, $"{made.Count} image(s)");
        await _db.SaveChangesAsync(ct);
        return Ok(made.Select(m => new { m.Id, m.Width, m.Height, m.IsCover }));
    }

    public record MediaUpdate(string? AltEn, string? AltBn, string? Credit, bool? IsCover);

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, MediaUpdate r, CancellationToken ct)
    {
        var m = await _db.Media.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (m is null) return NotFound();
        if (FieldRules.HasMarkup(r.AltEn) || FieldRules.HasMarkup(r.AltBn) || FieldRules.HasMarkup(r.Credit)) return BadRequest(new { message = "HTML is not allowed." });
        m.AltEn = FieldRules.Clean(r.AltEn); m.AltBn = FieldRules.Clean(r.AltBn); m.Credit = FieldRules.Clean(r.Credit);
        if (r.IsCover == true && m.ContentItemId != null)
        {
            foreach (var o in await _db.Media.Where(x => x.ContentItemId == m.ContentItemId && x.IsCover).ToListAsync(ct)) o.IsCover = false;
            m.IsCover = true;
        }
        _audit.Add("media.update", "Media", id);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var m = await _db.Media.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (m is null) return NotFound();
        _upload.Delete(m); _db.Media.Remove(m);
        _audit.Add("media.delete", "Media", id);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}

[ApiController, Route("api/admin/submissions")]
[Authorize(Policy = "perm:" + P.SubmissionsView)]
public class AdminSubmissionsController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly SubmissionService _subs;
    private readonly IdentityService _ids;
    public AdminSubmissionsController(NetrokonaDbContext db, SubmissionService subs, IdentityService ids) { _db = db; _subs = subs; _ids = ids; }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? status, [FromQuery] string? type, [FromQuery] string? q, [FromQuery] bool? duplicates, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100); page = Math.Max(1, page);
        var query = _db.Submissions.AsNoTracking().AsQueryable();
        if (Enum.TryParse<SubmissionStatus>(status, true, out var st)) query = query.Where(s => s.Status == st);
        if (Enum.TryParse<ContentType>(type, true, out var t)) query = query.Where(s => s.ContentType == t);
        if (duplicates == true) query = query.Where(s => s.DuplicateScore >= 0.8);
        if (!string.IsNullOrWhiteSpace(q)) { var n = q.Trim(); query = query.Where(s => s.TrackingCode.Contains(n) || s.SubmitterName.Contains(n) || s.NormalizedTitle.Contains(n.ToLower())); }
        var total = await query.CountAsync(ct);
        var rows = await query.OrderBy(s => s.Status == SubmissionStatus.Approved || s.Status == SubmissionStatus.Rejected).ThenByDescending(s => s.CreatedAtUtc)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(s => new { s.Id, s.TrackingCode, kind = s.Kind.ToString(), type = s.ContentType.ToString(), status = s.Status.ToString(), s.SubmitterName, s.NormalizedTitle, s.DuplicateScore, s.CreatedAtUtc, s.UpdatedAtUtc, s.Version })
            .ToListAsync(ct);
        return Ok(new { total, page, pageSize, items = rows });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var s = await _db.Submissions.AsNoTracking().Include(x => x.Events).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (s is null) return NotFound();
        var fields = System.Text.Json.JsonSerializer.Deserialize<ContentFields>(s.PayloadJson, SubmissionOptions.Json);
        var media = await _db.Media.AsNoTracking().Where(m => m.SubmissionId == id).Select(m => new { m.Id, status = m.Status.ToString(), m.Width, m.Height, m.OriginalName, url = "/api/admin/media/" + m.Id + "/file" }).ToListAsync(ct);
        var names = await _ids.GetDisplayAsync(s.Events.Where(e => e.ReviewerId != null).Select(e => e.ReviewerId!.Value).Append(s.ReviewedBy ?? Guid.Empty), ct);
        object? dupContent = null, target = null;
        if (s.DuplicateOfContentId != null) dupContent = await _db.Content.AsNoTracking().Where(c => c.Id == s.DuplicateOfContentId).Select(c => new { c.Id, c.Slug, c.TitleEn, c.TitleBn, state = c.PublishState.ToString() }).FirstOrDefaultAsync(ct);
        if (s.TargetContentId != null) target = await _db.Content.AsNoTracking().FirstOrDefaultAsync(c => c.Id == s.TargetContentId, ct);
        return Ok(new
        {
            s.Id, s.TrackingCode, kind = s.Kind.ToString(), type = s.ContentType.ToString(), status = s.Status.ToString(), s.Version,
            s.SubmitterName, s.SubmitterEmail, s.SubmitterPhone, s.Message, s.PublicNote, s.DuplicateScore, s.DuplicateOfSubmissionId,
            duplicateContent = dupContent, target, s.ResultContentId, s.CreatedAtUtc, s.UpdatedAtUtc, fields, media,
            reviewedBy = s.ReviewedBy is { } r && names.TryGetValue(r, out var n) ? n.Name : null,
            history = s.Events.OrderBy(e => e.AtUtc).Select(e => new
            {
                from = e.FromStatus?.ToString(), to = e.ToStatus.ToString(), e.InternalRemark, e.PublicNote, e.AtUtc,
                reviewer = e.ReviewerId is { } id2 && names.TryGetValue(id2, out var rn) ? rn.Name : (e.ReviewerId == null ? "Contributor / system" : "Unknown user"),
            }),
        });
    }

    [HttpPost("{id:guid}/status"), Authorize(Policy = "perm:" + P.SubmissionsReview)]
    public async Task<IActionResult> Status(Guid id, StatusChangeRequest r, CancellationToken ct)
    {
        if (!Enum.TryParse<SubmissionStatus>(r.Status, true, out var to)) return BadRequest(new { message = "Unknown status." });
        // Rejecting is a decision about publication, so it needs the approve permission too.
        if (to == SubmissionStatus.Rejected && !User.HasClaim("perm", P.SubmissionsApprove)) return Forbid();
        var s = await _subs.ChangeStatusAsync(id, to, r.InternalRemark, r.PublicNote, r.Version, User.Id()!.Value, ct);
        return Ok(new { s.Id, status = s.Status.ToString(), s.Version });
    }

    [HttpPost("{id:guid}/approve"), Authorize(Policy = "perm:" + P.SubmissionsApprove)]
    public async Task<IActionResult> Approve(Guid id, ApproveRequest r, CancellationToken ct)
    {
        if (r.Publish && !User.HasClaim("perm", P.ContentPublish)) return Forbid();   // publishing needs its own permission
        var (s, c) = await _subs.ApproveAsync(id, r.Publish, r.InternalRemark, r.PublicNote, r.Version, User.Id()!.Value, ct);
        return Ok(new { s.Id, status = s.Status.ToString(), s.Version, contentId = c.Id, contentState = c.PublishState.ToString() });
    }
}

[ApiController, Route("api/admin")]
[Authorize]
public class AdminMiscController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly IdentityService _ids;
    public AdminMiscController(NetrokonaDbContext db, IdentityService ids) { _db = db; _ids = ids; }

    [HttpGet("stats"), Authorize(Policy = "perm:" + P.ContentView)]
    public async Task<IActionResult> Stats(CancellationToken ct) => Ok(new
    {
        content = await _db.Content.GroupBy(c => c.PublishState).Select(g => new { state = g.Key.ToString(), count = g.Count() }).ToListAsync(ct),
        submissions = await _db.Submissions.GroupBy(s => s.Status).Select(g => new { status = g.Key.ToString(), count = g.Count() }).ToListAsync(ct),
        potentialDuplicates = await _db.Submissions.CountAsync(s => s.DuplicateScore >= 0.8 && (s.Status == SubmissionStatus.Pending || s.Status == SubmissionStatus.UnderReview), ct),
    });

    [HttpGet("audit"), Authorize(Policy = "perm:" + P.AuditView)]
    public async Task<IActionResult> Audit([FromQuery] string? entityType, [FromQuery] string? entityId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 200); page = Math.Max(1, page);
        var q = _db.AuditLogs.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(entityType)) q = q.Where(a => a.EntityType == entityType);
        if (!string.IsNullOrWhiteSpace(entityId)) q = q.Where(a => a.EntityId == entityId);
        var total = await q.CountAsync(ct);
        var rows = await q.OrderByDescending(a => a.Id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        var names = await _ids.GetDisplayAsync(rows.Where(r => r.UserId != null).Select(r => r.UserId!.Value), ct);   // resolved from the shared DB
        return Ok(new
        {
            total, page, pageSize,
            items = rows.Select(a => new { a.Id, a.AtUtc, a.Action, a.EntityType, a.EntityId, a.Details, a.UserId, user = a.UserId is { } u && names.TryGetValue(u, out var n) ? n.Name : null }),
        });
    }
}

/// <summary>SuperAdmin tools: assign EXISTING shared users to this application and manage their Netrokona roles.
/// Every call is scoped to the "netrokona" application key; no endpoint creates a global account or touches another application.</summary>
[ApiController, Route("api/admin/members")]
[Authorize(Policy = "perm:" + P.MembersManage)]
public class AdminMembersController : ControllerBase
{
    private readonly ApplicationAccessService _access;
    private readonly IdentityService _ids;
    private readonly AccessLoader _loader;
    private readonly NetrokonaDbContext _db;
    private readonly AuditService _audit;
    public AdminMembersController(ApplicationAccessService access, IdentityService ids, AccessLoader loader, NetrokonaDbContext db, AuditService audit)
    { _access = access; _ids = ids; _loader = loader; _db = db; _audit = audit; }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct) => Ok(await _access.ListMembersAsync(NetrokonaApp.Key, ct));

    /// <summary>Exact-email lookup of an existing global account (no directory browsing).</summary>
    [HttpGet("lookup")]
    public async Task<IActionResult> Lookup([FromQuery] string email, CancellationToken ct)
    {
        var u = string.IsNullOrWhiteSpace(email) ? null : await _ids.FindByEmailAsync(email, ct);
        if (u is null) return NotFound(new { message = "No global account with that email. Accounts are created in the central identity system, not here." });
        var members = await _access.ListMembersAsync(NetrokonaApp.Key, ct);
        return Ok(new { userId = u.Id, u.FullName, u.Email, isActive = u.IsActive, isMember = members.Any(m => m.UserId == u.Id && m.MembershipActive) });
    }

    [HttpPost]
    public async Task<IActionResult> Assign(MemberAssignRequest r, CancellationToken ct)
    {
        try
        {
            var added = await _access.AssignUserAsync(NetrokonaApp.Key, r.UserId, User.Id(), ct);
            _audit.Add(added ? "member.assign" : "member.assign_noop", "Member", r.UserId);
            await _db.SaveChangesAsync(ct);
            _loader.Invalidate(r.UserId);
            return Ok(new { assigned = added, message = added ? "User assigned to Netrokona." : "User was already assigned; nothing changed." });
        }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
    }

    [HttpPut("{userId:guid}/roles")]
    public async Task<IActionResult> SetRoles(Guid userId, MemberRolesRequest r, CancellationToken ct)
    {
        try
        {
            await _access.SetUserRolesAsync(NetrokonaApp.Key, userId, r.Roles ?? Array.Empty<string>(), User.Id(), ct);
            _audit.Add("member.roles", "Member", userId, string.Join(",", r.Roles ?? Array.Empty<string>()));
            await _db.SaveChangesAsync(ct);
            _loader.Invalidate(userId);
            return NoContent();
        }
        catch (ArgumentException e) { return BadRequest(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpDelete("{userId:guid}")]
    public async Task<IActionResult> Remove(Guid userId, CancellationToken ct)
    {
        try
        {
            await _access.RemoveUserAsync(NetrokonaApp.Key, userId, ct);
            _audit.Add("member.remove", "Member", userId);
            await _db.SaveChangesAsync(ct);
            _loader.Invalidate(userId);
            return NoContent();
        }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }

    [HttpGet("roles")]
    public async Task<IActionResult> Roles(CancellationToken ct) => Ok(new
    {
        roles = (await _access.ListRolesAsync(NetrokonaApp.Key, ct)).Select(r => new { r.Name, r.Permissions, r.IsSystem }),
        permissions = await _access.ListPermissionsAsync(NetrokonaApp.Key, ct),
    });

    [HttpPut("roles/{role}/permissions"), Authorize(Policy = "perm:" + P.RolesManage)]
    public async Task<IActionResult> SetRolePermissions(string role, RolePermissionsRequest r, CancellationToken ct)
    {
        try
        {
            await _access.SetRolePermissionsAsync(NetrokonaApp.Key, role, r.Permissions ?? Array.Empty<string>(), ct);
            _audit.Add("role.permissions", "Role", role, string.Join(",", r.Permissions ?? Array.Empty<string>()));
            await _db.SaveChangesAsync(ct);
            return NoContent();
        }
        catch (KeyNotFoundException e) { return NotFound(new { message = e.Message }); }
        catch (ArgumentException e) { return BadRequest(new { message = e.Message }); }
        catch (InvalidOperationException e) { return Conflict(new { message = e.Message }); }
    }
}

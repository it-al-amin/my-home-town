using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Security;
using NetrokonaCms.Api.Services;
using SharedIdentity.Core;
using P = NetrokonaCms.Api.Security.NetrokonaApp.P;

namespace NetrokonaCms.Api.Controllers;

[ApiController, Route("api/public/comments")]
public class PublicCommentsController : ControllerBase
{
    private readonly CommentService _comments;
    public PublicCommentsController(CommentService comments) => _comments = comments;

    /// <summary>Approved comments of one page, newest first.</summary>
    [HttpGet, EnableRateLimiting("public-read")]
    public async Task<IActionResult> List([FromQuery] string? page, CancellationToken ct) =>
        CommentService.NormalizePage(page) is { } p
            ? Ok(new { page = p, items = await _comments.ApprovedAsync(p, ct) })
            : BadRequest(new { message = "Unknown page." });

    /// <summary>Creates a Pending comment. It is not shown on the site until a moderator approves it.</summary>
    [HttpPost, EnableRateLimiting("comment")]
    public async Task<IActionResult> Create(NewCommentRequest r, CancellationToken ct)
    {
        var (comment, errors) = await _comments.CreateAsync(r, ct);
        if (errors.Count > 0) return BadRequest(new { message = "Validation failed.", errors });
        return Accepted(new
        {
            id = comment?.Id,
            status = nameof(CommentStatus.Pending),
            message = "Thank you. Your comment will appear after a moderator approves it.",
        });
    }
}

[ApiController, Route("api/admin/comments")]
[Authorize(Policy = "perm:" + P.SubmissionsView)]
public class AdminCommentsController : ControllerBase
{
    private readonly NetrokonaDbContext _db;
    private readonly CommentService _comments;
    public AdminCommentsController(NetrokonaDbContext db, CommentService comments) { _db = db; _comments = comments; }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? status, [FromQuery] string? page, [FromQuery] int pageNo = 1, [FromQuery] int pageSize = 30, CancellationToken ct = default)
    {
        pageSize = Math.Clamp(pageSize, 1, 100); pageNo = Math.Max(1, pageNo);
        var q = _db.Comments.AsNoTracking().AsQueryable();
        if (Enum.TryParse<CommentStatus>(status, true, out var st)) q = q.Where(c => c.Status == st);
        if (CommentService.NormalizePage(page) is { } p) q = q.Where(c => c.PageKey == p);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(c => c.CreatedAtUtc).Skip((pageNo - 1) * pageSize).Take(pageSize)
            .Select(c => new { c.Id, c.PageKey, c.AuthorName, c.Body, status = c.Status.ToString(), c.CreatedAtUtc, c.ReviewedAtUtc })
            .ToListAsync(ct);
        return Ok(new { total, page = pageNo, pageSize, items });
    }

    [HttpPost("{id:guid}/approve"), Authorize(Policy = "perm:" + P.SubmissionsApprove)]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct) =>
        await _comments.ReviewAsync(id, CommentStatus.Approved, User.Id()!.Value, ct) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/reject"), Authorize(Policy = "perm:" + P.SubmissionsApprove)]
    public async Task<IActionResult> Reject(Guid id, CancellationToken ct) =>
        await _comments.ReviewAsync(id, CommentStatus.Rejected, User.Id()!.Value, ct) ? NoContent() : NotFound();

    [HttpDelete("{id:guid}"), Authorize(Policy = "perm:" + P.SubmissionsApprove)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct) =>
        await _comments.DeleteAsync(id, ct) ? NoContent() : NotFound();
}

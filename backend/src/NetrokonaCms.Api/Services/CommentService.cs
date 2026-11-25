using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;

namespace NetrokonaCms.Api.Services;

public record NewCommentRequest(string? Page, string? Name, string? Body, string? Website);
public record PublicComment(Guid Id, string Name, string Body, DateTime CreatedAtUtc);

/// <summary>Visitor comments per page. Every comment starts Pending; only Approved ones are ever returned publicly.</summary>
public class CommentService
{
    /// <summary>A site path: lowercase letters, digits, '-', '/' (no query, hash or host).</summary>
    private static readonly Regex PagePattern = new(@"^/[a-z0-9\-/]{0,199}$", RegexOptions.Compiled);
    private readonly NetrokonaDbContext _db;
    private readonly RequestInfo _req;
    private readonly AuditService _audit;
    public CommentService(NetrokonaDbContext db, RequestInfo req, AuditService audit) { _db = db; _req = req; _audit = audit; }

    public static string? NormalizePage(string? page)
    {
        var p = (page ?? "").Trim().ToLowerInvariant();
        if (p.Length > 1) p = p.TrimEnd('/');
        return PagePattern.IsMatch(p) && !p.Contains("//") ? p : null;
    }

    public async Task<List<PublicComment>> ApprovedAsync(string page, CancellationToken ct) =>
        await _db.Comments.AsNoTracking()
            .Where(c => c.PageKey == page && c.Status == CommentStatus.Approved)
            .OrderByDescending(c => c.CreatedAtUtc).Take(200)
            .Select(c => new PublicComment(c.Id, c.AuthorName, c.Body, c.CreatedAtUtc))
            .ToListAsync(ct);

    /// <returns>The pending comment, or validation errors. A filled honeypot is accepted silently and discarded.</returns>
    public async Task<(Comment? Comment, Dictionary<string, string[]> Errors)> CreateAsync(NewCommentRequest r, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();
        void Err(string k, string m) => errors[k] = new[] { m };
        var page = NormalizePage(r.Page);
        var name = FieldRules.Clean(r.Name);
        var body = FieldRules.Clean(r.Body);
        if (page is null) Err("page", "Unknown page.");
        if (name is null || name.Length < 2 || name.Length > 80) Err("name", "Name must be 2-80 characters.");
        if (body is null || body.Length < 2 || body.Length > 2000) Err("body", "Comment must be 2-2000 characters.");
        if (FieldRules.HasMarkup(name)) Err("name", "HTML or script content is not allowed.");
        if (FieldRules.HasMarkup(body)) Err("body", "HTML or script content is not allowed.");
        if (errors.Count > 0) return (null, errors);
        if (!string.IsNullOrEmpty(r.Website)) return (null, errors);   // bot filled the hidden field

        var ip = _req.IpHash;
        var since = DateTime.UtcNow.AddHours(-24);
        if (await _db.Comments.AnyAsync(c => c.ClientIpHash == ip && c.PageKey == page && c.Body == body && c.CreatedAtUtc > since, ct))
        {
            Err("body", "You already sent this comment.");
            return (null, errors);
        }

        var comment = new Comment { PageKey = page!, AuthorName = name!, Body = body!, ClientIpHash = ip };
        _db.Comments.Add(comment);
        _audit.Add("comment.create", "Comment", comment.Id, $"page={page}");
        await _db.SaveChangesAsync(ct);
        return (comment, errors);
    }

    public async Task<bool> ReviewAsync(Guid id, CommentStatus to, Guid reviewer, CancellationToken ct)
    {
        var c = await _db.Comments.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return false;
        var from = c.Status;
        c.Status = to; c.ReviewedBy = reviewer; c.ReviewedAtUtc = DateTime.UtcNow;
        _audit.Add(to == CommentStatus.Approved ? "comment.approve" : "comment.reject", "Comment", c.Id, $"{from}->{to} page={c.PageKey}");
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var c = await _db.Comments.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return false;
        _db.Comments.Remove(c);
        _audit.Add("comment.delete", "Comment", c.Id, $"page={c.PageKey} status={c.Status}");
        await _db.SaveChangesAsync(ct);
        return true;
    }
}

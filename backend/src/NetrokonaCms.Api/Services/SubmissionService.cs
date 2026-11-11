using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;

namespace NetrokonaCms.Api.Services;

public class ApiException : Exception
{
    public int Status { get; }
    public object? Errors { get; }
    public ApiException(int status, string message, object? errors = null) : base(message) { Status = status; Errors = errors; }
}

public class SubmissionOptions
{
    public int MaxOpenPerClient { get; set; } = 20;
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() } };
}

/// <summary>Moderation workflow. Public submissions never create published content on their own: only an
/// authorised reviewer's Approve does, and every transition is recorded as a ReviewEvent + audit row.</summary>
public class SubmissionService
{
    private static readonly Dictionary<SubmissionStatus, SubmissionStatus[]> Allowed = new()
    {
        [SubmissionStatus.Pending] = new[] { SubmissionStatus.UnderReview, SubmissionStatus.NeedsCorrection, SubmissionStatus.Rejected, SubmissionStatus.Approved },
        [SubmissionStatus.UnderReview] = new[] { SubmissionStatus.Pending, SubmissionStatus.NeedsCorrection, SubmissionStatus.Rejected, SubmissionStatus.Approved },
        [SubmissionStatus.NeedsCorrection] = new[] { SubmissionStatus.Pending, SubmissionStatus.Rejected },
        [SubmissionStatus.Rejected] = new[] { SubmissionStatus.UnderReview },
        [SubmissionStatus.Approved] = Array.Empty<SubmissionStatus>(),
    };

    private readonly NetrokonaDbContext _db;
    private readonly DuplicateDetector _dups;
    private readonly UploadService _upload;
    private readonly ContentService _content;
    private readonly AuditService _audit;
    private readonly RequestInfo _req;
    private readonly SubmissionOptions _opt;

    public SubmissionService(NetrokonaDbContext db, DuplicateDetector dups, UploadService upload, ContentService content,
        AuditService audit, RequestInfo req, SubmissionOptions opt)
    { _db = db; _dups = dups; _upload = upload; _content = content; _audit = audit; _req = req; _opt = opt; }

    // ---------------------------------------------------------------- public side
    public async Task<(Submission Sub, string EditToken, List<string> Warnings)> CreateAsync(NewSubmissionRequest r, IReadOnlyList<IFormFile> files, CancellationToken ct)
    {
        FieldRules.Normalize(r.Fields);
        var s = r.Submitter;
        var name = FieldRules.Clean(s.Name);
        var errors = FieldRules.Validate(r.Fields, requireTitle: r.TargetContentId == null);
        if (name is null || name.Length < 2) errors["submitter.name"] = new[] { "Your name is required." };
        if (FieldRules.HasMarkup(name) || FieldRules.HasMarkup(s.Message)) errors["submitter"] = new[] { "HTML or script content is not allowed." };
        if (!string.IsNullOrWhiteSpace(s.Email) && !new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(s.Email)) errors["submitter.email"] = new[] { "Invalid email address." };
        if (s.Message is { Length: > 2000 }) errors["submitter.message"] = new[] { "Message is too long." };
        if (r.TargetContentId != null && string.IsNullOrWhiteSpace(s.Message)) errors["submitter.message"] = new[] { "Explain what should be corrected." };
        if (files.Count > _upload.MaxPerSubmission) errors["images"] = new[] { $"At most {_upload.MaxPerSubmission} images per submission." };

        ContentItem? target = null;
        if (r.TargetContentId != null)
        {
            target = await _db.Content.AsNoTracking().FirstOrDefaultAsync(c => c.Id == r.TargetContentId && c.PublishState == PublishState.Published && c.IsActive, ct);
            if (target is null) errors["targetContentId"] = new[] { "The content to correct was not found." };
            else r.Fields.Type = target.Type;
        }
        if (errors.Count > 0) throw new ApiException(400, "Validation failed.", errors);

        var ip = _req.IpHash;
        var open = await _db.Submissions.CountAsync(x => x.ClientIpHash == ip && (x.Status == SubmissionStatus.Pending || x.Status == SubmissionStatus.UnderReview), ct);
        if (open >= _opt.MaxOpenPerClient) throw new ApiException(429, "Too many open submissions. Please wait until some are reviewed.");
        var norm = Text.NormalizeTitle(r.Fields.TitleEn ?? r.Fields.TitleBn);
        var since = DateTime.UtcNow.AddHours(-24);
        if (norm.Length > 0 && r.TargetContentId == null && await _db.Submissions.AnyAsync(x => x.ClientIpHash == ip && x.NormalizedTitle == norm && x.ContentType == r.Fields.Type && x.CreatedAtUtc > since, ct))
            throw new ApiException(409, "You already sent this submission recently.");

        var dup = r.TargetContentId == null ? await _dups.FindAsync(r.Fields.Type, r.Fields, ct: ct) : new DuplicateMatch(0, null, null);
        var token = Text.NewSecret();
        var sub = new Submission
        {
            TrackingCode = Text.NewTrackingCode(), EditTokenHash = Text.Hash(token),
            Kind = r.TargetContentId == null ? SubmissionKind.NewContent : SubmissionKind.Correction,
            ContentType = r.Fields.Type, TargetContentId = r.TargetContentId, PayloadJson = JsonSerializer.Serialize(r.Fields, SubmissionOptions.Json),
            SubmitterName = name!, SubmitterEmail = FieldRules.Clean(s.Email), SubmitterPhone = FieldRules.Clean(s.Phone), Message = FieldRules.Clean(s.Message),
            Status = SubmissionStatus.Pending, ClientIpHash = ip, NormalizedTitle = norm,
            DuplicateScore = dup.Score, DuplicateOfContentId = dup.ContentId, DuplicateOfSubmissionId = dup.SubmissionId,
        };
        sub.Events.Add(new ReviewEvent { SubmissionId = sub.Id, FromStatus = null, ToStatus = SubmissionStatus.Pending, InternalRemark = "Submitted by the public." });
        _db.Submissions.Add(sub);

        var warnings = new List<string>();
        var saved = new List<MediaAsset>();
        try
        {
            foreach (var f in files)
            {
                var m = await _upload.SaveAsync(f, null, ct);
                if (saved.Any(x => x.Sha256 == m.Sha256)) { _upload.Delete(m); warnings.Add($"{f.FileName}: duplicate image ignored."); continue; }
                m.SubmissionId = sub.Id; m.Status = MediaStatus.Pending; saved.Add(m); _db.Media.Add(m);
            }
        }
        catch (UploadRejected e)
        {
            foreach (var m in saved) _upload.Delete(m);
            throw new ApiException(400, "Image upload rejected.", new Dictionary<string, string[]> { ["images"] = new[] { e.Message } });
        }
        _audit.Add("submission.create", "Submission", sub.Id, $"kind={sub.Kind} type={sub.ContentType} dupScore={dup.Score}", userId: null);
        await _db.SaveChangesAsync(ct);
        return (sub, token, warnings);
    }

    /// <summary>Submitter responds to a NeedsCorrection request using the secret token they received.</summary>
    public async Task<Submission> ResubmitAsync(string code, string token, ContentFields fields, SubmitterInfo? info, IReadOnlyList<IFormFile> files, CancellationToken ct)
    {
        var sub = await _db.Submissions.Include(s => s.Events).FirstOrDefaultAsync(s => s.TrackingCode == code, ct);
        if (sub is null || !FixedEquals(sub.EditTokenHash, Text.Hash(token ?? ""))) throw new ApiException(404, "Submission not found.");
        if (sub.Status != SubmissionStatus.NeedsCorrection) throw new ApiException(409, "This submission is not waiting for corrections.");
        FieldRules.Normalize(fields);
        fields.Type = sub.ContentType;
        var errors = FieldRules.Validate(fields, requireTitle: sub.Kind == SubmissionKind.NewContent);
        if (errors.Count > 0) throw new ApiException(400, "Validation failed.", errors);

        var existing = await _db.Media.CountAsync(m => m.SubmissionId == sub.Id && m.Status != MediaStatus.Rejected, ct);
        if (existing + files.Count > _upload.MaxPerSubmission) throw new ApiException(400, "Too many images.", new Dictionary<string, string[]> { ["images"] = new[] { $"At most {_upload.MaxPerSubmission} images per submission." } });
        var saved = new List<MediaAsset>();
        try { foreach (var f in files) { var m = await _upload.SaveAsync(f, null, ct); m.SubmissionId = sub.Id; saved.Add(m); _db.Media.Add(m); } }
        catch (UploadRejected e) { foreach (var m in saved) _upload.Delete(m); throw new ApiException(400, "Image upload rejected.", new Dictionary<string, string[]> { ["images"] = new[] { e.Message } }); }

        sub.PayloadJson = JsonSerializer.Serialize(fields, SubmissionOptions.Json);
        sub.NormalizedTitle = Text.NormalizeTitle(fields.TitleEn ?? fields.TitleBn);
        if (!string.IsNullOrWhiteSpace(info?.Message)) sub.Message = FieldRules.Clean(info!.Message);
        await Transition(sub, SubmissionStatus.Pending, null, null, null, "Resubmitted by the contributor.");
        _audit.Add("submission.resubmit", "Submission", sub.Id);
        await _db.SaveChangesAsync(ct);
        return sub;
    }

    private static bool FixedEquals(string a, string b) =>
        System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(System.Text.Encoding.UTF8.GetBytes(a), System.Text.Encoding.UTF8.GetBytes(b));

    // ---------------------------------------------------------------- reviewer side
    private Task Transition(Submission s, SubmissionStatus to, Guid? reviewer, string? internalRemark, string? publicNote, string? systemRemark = null)
    {
        if (!Allowed[s.Status].Contains(to)) throw new ApiException(409, $"A {s.Status} submission cannot become {to}.");
        var ev = new ReviewEvent { SubmissionId = s.Id, FromStatus = s.Status, ToStatus = to, ReviewerId = reviewer, InternalRemark = internalRemark ?? systemRemark, PublicNote = publicNote };
        s.Status = to;
        if (reviewer != null) { s.ReviewedBy = reviewer; s.ReviewedAtUtc = DateTime.UtcNow; }
        if (publicNote != null) s.PublicNote = publicNote;
        s.UpdatedAtUtc = DateTime.UtcNow;
        s.Version++;
        _db.ReviewEvents.Add(ev);
        return Task.CompletedTask;
    }

    private async Task<Submission> Load(Guid id, int version, CancellationToken ct)
    {
        var s = await _db.Submissions.FirstOrDefaultAsync(x => x.Id == id, ct) ?? throw new ApiException(404, "Submission not found.");
        if (s.Version != version) throw new ApiException(409, "This submission was changed by someone else. Reload and try again.");
        return s;
    }

    public async Task<Submission> ChangeStatusAsync(Guid id, SubmissionStatus to, string? internalRemark, string? publicNote, int version, Guid reviewer, CancellationToken ct)
    {
        if (to == SubmissionStatus.Approved) throw new ApiException(400, "Use the approve action.");
        var s = await Load(id, version, ct);
        if ((to is SubmissionStatus.NeedsCorrection or SubmissionStatus.Rejected) && string.IsNullOrWhiteSpace(publicNote))
            throw new ApiException(400, "A note for the contributor is required.", new Dictionary<string, string[]> { ["publicNote"] = new[] { "Explain what is wrong or what to correct." } });
        if (FieldRules.HasMarkup(internalRemark) || FieldRules.HasMarkup(publicNote)) throw new ApiException(400, "HTML is not allowed in remarks.");
        await Transition(s, to, reviewer, FieldRules.Clean(internalRemark), FieldRules.Clean(publicNote));

        if (to == SubmissionStatus.Rejected)
            foreach (var m in await _db.Media.Where(m => m.SubmissionId == id && m.Status == MediaStatus.Pending).ToListAsync(ct)) { m.Status = MediaStatus.Rejected; _upload.Delete(m); }
        _audit.Add("submission." + to.ToString().ToLowerInvariant(), "Submission", s.Id, publicNote, reviewer);
        await _db.SaveChangesAsync(ct);
        return s;
    }

    /// <summary>Approves: creates the content (new) or applies the corrected fields (correction). New content is
    /// published only when the reviewer asks for it; otherwise it becomes a Draft for the editors.</summary>
    public async Task<(Submission Sub, ContentItem Content)> ApproveAsync(Guid id, bool publish, string? internalRemark, string? publicNote, int version, Guid reviewer, CancellationToken ct)
    {
        var s = await Load(id, version, ct);
        var fields = JsonSerializer.Deserialize<ContentFields>(s.PayloadJson, SubmissionOptions.Json)!;
        var errors = FieldRules.Validate(fields, requireTitle: s.Kind == SubmissionKind.NewContent);
        if (errors.Count > 0) throw new ApiException(400, "The submission no longer passes validation.", errors);
        await Transition(s, SubmissionStatus.Approved, reviewer, FieldRules.Clean(internalRemark), FieldRules.Clean(publicNote));

        ContentItem content;
        if (s.Kind == SubmissionKind.NewContent)
        {
            content = await _content.CreateAsync(fields, reviewer, s.Id, publish, ct);
            _audit.Add("content.create", "Content", content.Id, "from submission " + s.TrackingCode, reviewer);
        }
        else
        {
            content = await _db.Content.FirstOrDefaultAsync(c => c.Id == s.TargetContentId, ct) ?? throw new ApiException(409, "The target content no longer exists.");
            var diff = ContentService.ApplyPartial(content, fields);
            content.UpdatedBy = reviewer; content.Version++;
            _audit.Add("content.correct", "Content", content.Id, ContentService.DiffJson(diff) + " from " + s.TrackingCode, reviewer);
        }
        s.ResultContentId = content.Id;

        var media = await _db.Media.Where(m => m.SubmissionId == id && m.Status == MediaStatus.Pending).ToListAsync(ct);
        var hasCover = content.Id != Guid.Empty && await _db.Media.AnyAsync(m => m.ContentItemId == content.Id && m.IsCover, ct);
        foreach (var m in media)
        {
            m.ContentItem = content; m.ContentItemId = content.Id; m.Status = MediaStatus.Approved; m.Credit ??= "Contributed by " + s.SubmitterName;
            if (!hasCover) { m.IsCover = true; hasCover = true; }
        }
        _audit.Add("submission.approved", "Submission", s.Id, $"result={content.Id} publish={publish}", reviewer);
        await _db.SaveChangesAsync(ct);
        return (s, content);
    }

    // ---------------------------------------------------------------- views
    public async Task<object?> PublicStatusAsync(string code, CancellationToken ct)
    {
        var s = await _db.Submissions.AsNoTracking().Include(x => x.Events).FirstOrDefaultAsync(x => x.TrackingCode == code, ct);
        if (s is null) return null;
        string? slug = null;
        if (s.Status == SubmissionStatus.Approved && s.ResultContentId != null)
            slug = await _db.Content.Where(c => c.Id == s.ResultContentId && c.PublishState == PublishState.Published && c.IsActive).Select(c => c.Slug).FirstOrDefaultAsync(ct);
        return new
        {
            s.TrackingCode, kind = s.Kind.ToString(), type = s.ContentType.ToString(), status = s.Status.ToString(), s.PublicNote,
            s.CreatedAtUtc, s.UpdatedAtUtc, publishedSlug = slug,
            canEdit = s.Status == SubmissionStatus.NeedsCorrection,
            timeline = s.Events.OrderBy(e => e.AtUtc).Select(e => new { status = e.ToStatus.ToString(), note = e.PublicNote, at = e.AtUtc }),
            // the payload is returned only so the contributor can edit; it never contains contact details
            fields = s.Status == SubmissionStatus.NeedsCorrection ? JsonSerializer.Deserialize<ContentFields>(s.PayloadJson, SubmissionOptions.Json) : null,
        };
    }
}

using System.Text.Json.Serialization;

namespace NetrokonaCms.Api.Domain;

// NOTE: this database holds Netrokona business data only. There is NO user/password table here.
// Every *By / UserId column is the GUID of a user in the shared identity database (no cross-database FK;
// existence is validated in code and display names are resolved from the shared DB on read).

public enum ContentType { Place, Institution, HealthFacility, GovernmentOffice, EmergencyService, News, Event, Info }
public enum PublishState { Draft, Published, Archived }
public enum SubmissionKind { NewContent, Correction }
public enum SubmissionStatus { Pending, UnderReview, Approved, Rejected, NeedsCorrection }
public enum MediaStatus { Pending, Approved, Rejected }

public class ContentItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ContentType Type { get; set; }
    public string Slug { get; set; } = "";
    public string TitleEn { get; set; } = "";
    public string TitleBn { get; set; } = "";
    public string? SummaryEn { get; set; }
    public string? SummaryBn { get; set; }
    public string? BodyEn { get; set; }
    public string? BodyBn { get; set; }
    public string? UpazilaId { get; set; }
    public string? Category { get; set; }
    public string? AddressEn { get; set; }
    public string? AddressBn { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Email { get; set; }
    public string? SourceName { get; set; }
    public string? SourceUrl { get; set; }
    public DateTime? EventStartUtc { get; set; }
    public DateTime? EventEndUtc { get; set; }
    public string NormalizedTitle { get; set; } = "";
    public PublishState PublishState { get; set; } = PublishState.Draft;
    /// <summary>Soft switch: inactive content is hidden publicly even if published.</summary>
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAtUtc { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public Guid? OriginSubmissionId { get; set; }
    public int Version { get; set; } = 1;
    public List<MediaAsset> Media { get; set; } = new();
}

public class MediaAsset
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? ContentItemId { get; set; }
    public Guid? SubmissionId { get; set; }
    [JsonIgnore] public string StoredName { get; set; } = "";
    public string OriginalName { get; set; } = "";
    public string ContentType { get; set; } = "image/jpeg";
    public long SizeBytes { get; set; }
    public string Sha256 { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
    public string? AltEn { get; set; }
    public string? AltBn { get; set; }
    public string? Credit { get; set; }
    public MediaStatus Status { get; set; } = MediaStatus.Pending;
    public bool IsCover { get; set; }
    public Guid? UploadedBy { get; set; }      // shared-identity user, null for anonymous public uploads
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    [JsonIgnore] public ContentItem? ContentItem { get; set; }
}

public class Submission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TrackingCode { get; set; } = "";
    public string EditTokenHash { get; set; } = "";
    public SubmissionKind Kind { get; set; }
    public ContentType ContentType { get; set; }
    public Guid? TargetContentId { get; set; }
    public string PayloadJson { get; set; } = "{}";
    public string SubmitterName { get; set; } = "";
    public string? SubmitterEmail { get; set; }
    public string? SubmitterPhone { get; set; }
    public string? Message { get; set; }
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;
    /// <summary>Visible to the submitter through the tracking page.</summary>
    public string? PublicNote { get; set; }
    public Guid? DuplicateOfContentId { get; set; }
    public Guid? DuplicateOfSubmissionId { get; set; }
    public double DuplicateScore { get; set; }
    public string ClientIpHash { get; set; } = "";
    public string NormalizedTitle { get; set; } = "";
    public Guid? ReviewedBy { get; set; }
    public DateTime? ReviewedAtUtc { get; set; }
    public Guid? ResultContentId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public int Version { get; set; } = 1;
    public List<ReviewEvent> Events { get; set; } = new();
}

public class ReviewEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SubmissionId { get; set; }
    public SubmissionStatus? FromStatus { get; set; }
    public SubmissionStatus ToStatus { get; set; }
    public Guid? ReviewerId { get; set; }          // shared-identity user; null = the submitter / system
    public string? InternalRemark { get; set; }    // staff only
    public string? PublicNote { get; set; }        // shown to the submitter
    public DateTime AtUtc { get; set; } = DateTime.UtcNow;
}

public class AuditLog
{
    public long Id { get; set; }
    public DateTime AtUtc { get; set; } = DateTime.UtcNow;
    public Guid? UserId { get; set; }
    public string Action { get; set; } = "";
    public string EntityType { get; set; } = "";
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public string? IpHash { get; set; }
}

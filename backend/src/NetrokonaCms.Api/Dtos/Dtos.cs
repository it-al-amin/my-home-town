using System.Text.RegularExpressions;
using NetrokonaCms.Api.Domain;

namespace NetrokonaCms.Api.Dtos;

/// <summary>The editable fields of any content type. Used by admin create/edit AND as the payload of public submissions.</summary>
public class ContentFields
{
    public ContentType Type { get; set; }
    public string? TitleEn { get; set; }
    public string? TitleBn { get; set; }
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
}

public static class FieldRules
{
    public static readonly string[] Upazilas =
        { "netrokona-sadar", "durgapur", "kalmakanda", "purbadhala", "kendua", "barhatta", "atpara", "madan", "mohanganj", "khaliajuri" };

    private static readonly Regex Html = new(@"<\s*/?\s*[a-zA-Z!]|javascript:|on\w+\s*=", RegexOptions.Compiled | RegexOptions.IgnoreCase);
    private static readonly Regex Phone = new(@"^[0-9+\-\s()]{5,20}$", RegexOptions.Compiled);

    /// <summary>All text is stored and shown as plain text: markup in submitted fields is rejected, not "cleaned".</summary>
    public static bool HasMarkup(string? s) => !string.IsNullOrEmpty(s) && Html.IsMatch(s);

    public static string? Clean(string? s)
    {
        if (s is null) return null;
        var t = new string(s.Where(c => !char.IsControl(c) || c is '\n' or '\r' or '\t').ToArray()).Trim();
        return t.Length == 0 ? null : t;
    }

    public static void Normalize(ContentFields f)
    {
        f.TitleEn = Clean(f.TitleEn); f.TitleBn = Clean(f.TitleBn); f.SummaryEn = Clean(f.SummaryEn); f.SummaryBn = Clean(f.SummaryBn);
        f.BodyEn = Clean(f.BodyEn); f.BodyBn = Clean(f.BodyBn); f.UpazilaId = Clean(f.UpazilaId)?.ToLowerInvariant();
        f.Category = Clean(f.Category); f.AddressEn = Clean(f.AddressEn); f.AddressBn = Clean(f.AddressBn);
        f.Phone = Clean(f.Phone); f.Website = Clean(f.Website); f.Email = Clean(f.Email);
        f.SourceName = Clean(f.SourceName); f.SourceUrl = Clean(f.SourceUrl);
    }

    public static Dictionary<string, string[]> Validate(ContentFields f, bool requireTitle = true)
    {
        var e = new Dictionary<string, string[]>();
        void Err(string k, string m) => e[k] = new[] { m };
        void Max(string k, string? v, int n) { if (v != null && v.Length > n) Err(k, $"Must be at most {n} characters."); if (HasMarkup(v)) Err(k, "HTML or script content is not allowed."); }

        if (!Enum.IsDefined(f.Type)) Err("type", "Unknown content type.");
        if (requireTitle && string.IsNullOrWhiteSpace(f.TitleEn) && string.IsNullOrWhiteSpace(f.TitleBn)) Err("title", "A title in English or Bengali is required.");
        Max("titleEn", f.TitleEn, 300); Max("titleBn", f.TitleBn, 300);
        Max("summaryEn", f.SummaryEn, 1000); Max("summaryBn", f.SummaryBn, 1000);
        Max("bodyEn", f.BodyEn, 20000); Max("bodyBn", f.BodyBn, 20000);
        Max("category", f.Category, 80); Max("addressEn", f.AddressEn, 500); Max("addressBn", f.AddressBn, 500);
        Max("sourceName", f.SourceName, 200);
        if (f.UpazilaId != null && !Upazilas.Contains(f.UpazilaId)) Err("upazilaId", "Unknown upazila.");
        if (f.Latitude is { } la && (la < 20.5 || la > 26.7)) Err("latitude", "Latitude is outside Bangladesh.");
        if (f.Longitude is { } lo && (lo < 88.0 || lo > 92.8)) Err("longitude", "Longitude is outside Bangladesh.");
        if ((f.Latitude == null) != (f.Longitude == null)) Err("latitude", "Provide both latitude and longitude, or neither.");
        if (f.Phone != null && !Phone.IsMatch(f.Phone)) Err("phone", "Invalid phone number.");
        if (f.Email != null && !new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(f.Email)) Err("email", "Invalid email address.");
        foreach (var (k, v) in new[] { ("website", f.Website), ("sourceUrl", f.SourceUrl) })
            if (v != null && !(Uri.TryCreate(v, UriKind.Absolute, out var u) && (u.Scheme == "http" || u.Scheme == "https"))) Err(k, "Must be an http(s) URL.");
        if (f.EventStartUtc != null && f.EventEndUtc != null && f.EventEndUtc < f.EventStartUtc) Err("eventEndUtc", "End must be after start.");
        return e;
    }
}

public record SubmitterInfo(string? Name, string? Email, string? Phone, string? Message);

public record NewSubmissionRequest(ContentFields Fields, SubmitterInfo Submitter, Guid? TargetContentId);

public record StatusChangeRequest(string Status, string? InternalRemark, string? PublicNote, int Version);

public record ApproveRequest(bool Publish, string? InternalRemark, string? PublicNote, int Version);

public record ContentWriteRequest(ContentFields Fields, bool? IsActive, int? Version);

public record MemberAssignRequest(Guid UserId);
public record MemberRolesRequest(string[] Roles);
public record RolePermissionsRequest(string[] Permissions);
public record LoginRequest(string Email, string Password);

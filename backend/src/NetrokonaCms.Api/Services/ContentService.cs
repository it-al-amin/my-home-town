using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;

namespace NetrokonaCms.Api.Services;

public class ContentService
{
    private readonly NetrokonaDbContext _db;
    public ContentService(NetrokonaDbContext db) => _db = db;

    public async Task<string> UniqueSlugAsync(ContentFields f, CancellationToken ct)
    {
        var baseSlug = Text.Slugify(f.TitleEn);
        if (baseSlug.Length < 3) baseSlug = f.Type.ToString().ToLowerInvariant() + "-" + Guid.NewGuid().ToString("N")[..8];
        if (baseSlug.Length > 150) baseSlug = baseSlug[..150].Trim('-');
        var slug = baseSlug;
        for (var i = 2; await _db.Content.AnyAsync(c => c.Slug == slug, ct); i++) slug = $"{baseSlug}-{i}";
        return slug;
    }

    public async Task<ContentItem> CreateAsync(ContentFields f, Guid createdBy, Guid? originSubmission, bool publish, CancellationToken ct)
    {
        var c = new ContentItem
        {
            Type = f.Type, CreatedBy = createdBy, OriginSubmissionId = originSubmission,
            Slug = await UniqueSlugAsync(f, ct),
        };
        ApplyAll(c, f);
        if (publish) Publish(c, createdBy);
        _db.Content.Add(c);
        return c;
    }

    /// <summary>Admin edit: every field is replaced by the request.</summary>
    public static void ApplyAll(ContentItem c, ContentFields f)
    {
        c.TitleEn = f.TitleEn ?? ""; c.TitleBn = f.TitleBn ?? "";
        c.SummaryEn = f.SummaryEn; c.SummaryBn = f.SummaryBn; c.BodyEn = f.BodyEn; c.BodyBn = f.BodyBn;
        c.UpazilaId = f.UpazilaId; c.Category = f.Category; c.AddressEn = f.AddressEn; c.AddressBn = f.AddressBn;
        c.Latitude = f.Latitude; c.Longitude = f.Longitude; c.Phone = f.Phone; c.Website = f.Website; c.Email = f.Email;
        c.SourceName = f.SourceName; c.SourceUrl = f.SourceUrl; c.EventStartUtc = f.EventStartUtc; c.EventEndUtc = f.EventEndUtc;
        c.NormalizedTitle = Text.NormalizeTitle(string.IsNullOrEmpty(c.TitleEn) ? c.TitleBn : c.TitleEn);
        c.UpdatedAtUtc = DateTime.UtcNow;
    }

    /// <summary>Correction: only the fields the contributor actually supplied change; returns a changed-fields summary.</summary>
    public static Dictionary<string, object?[]> ApplyPartial(ContentItem c, ContentFields f)
    {
        var diff = new Dictionary<string, object?[]>();
        void Set<T>(string name, T? incoming, Func<T?> get, Action<T> set) where T : class
        { if (incoming != null && !Equals(incoming, get())) { diff[name] = new object?[] { get(), incoming }; set(incoming); } }
        void SetV<T>(string name, T? incoming, T? current, Action<T> set) where T : struct
        { if (incoming != null && !Equals(incoming, current)) { diff[name] = new object?[] { current, incoming }; set(incoming.Value); } }

        Set("titleEn", f.TitleEn, () => c.TitleEn, v => c.TitleEn = v); Set("titleBn", f.TitleBn, () => c.TitleBn, v => c.TitleBn = v);
        Set("summaryEn", f.SummaryEn, () => c.SummaryEn, v => c.SummaryEn = v); Set("summaryBn", f.SummaryBn, () => c.SummaryBn, v => c.SummaryBn = v);
        Set("bodyEn", f.BodyEn, () => c.BodyEn, v => c.BodyEn = v); Set("bodyBn", f.BodyBn, () => c.BodyBn, v => c.BodyBn = v);
        Set("upazilaId", f.UpazilaId, () => c.UpazilaId, v => c.UpazilaId = v); Set("category", f.Category, () => c.Category, v => c.Category = v);
        Set("addressEn", f.AddressEn, () => c.AddressEn, v => c.AddressEn = v); Set("addressBn", f.AddressBn, () => c.AddressBn, v => c.AddressBn = v);
        Set("phone", f.Phone, () => c.Phone, v => c.Phone = v); Set("website", f.Website, () => c.Website, v => c.Website = v);
        Set("email", f.Email, () => c.Email, v => c.Email = v);
        Set("sourceName", f.SourceName, () => c.SourceName, v => c.SourceName = v); Set("sourceUrl", f.SourceUrl, () => c.SourceUrl, v => c.SourceUrl = v);
        SetV("latitude", f.Latitude, c.Latitude, v => c.Latitude = v); SetV("longitude", f.Longitude, c.Longitude, v => c.Longitude = v);
        SetV("eventStartUtc", f.EventStartUtc, c.EventStartUtc, v => c.EventStartUtc = v); SetV("eventEndUtc", f.EventEndUtc, c.EventEndUtc, v => c.EventEndUtc = v);
        if (diff.Count > 0)
        {
            c.NormalizedTitle = Text.NormalizeTitle(string.IsNullOrEmpty(c.TitleEn) ? c.TitleBn : c.TitleEn);
            c.UpdatedAtUtc = DateTime.UtcNow;
        }
        return diff;
    }

    public static void Publish(ContentItem c, Guid by)
    {
        if (string.IsNullOrWhiteSpace(c.TitleEn) && string.IsNullOrWhiteSpace(c.TitleBn)) throw new InvalidOperationException("A title is required to publish.");
        c.PublishState = PublishState.Published;
        c.PublishedAtUtc ??= DateTime.UtcNow;
        c.UpdatedBy = by;
        c.UpdatedAtUtc = DateTime.UtcNow;
    }

    public static string DiffJson(Dictionary<string, object?[]> d) => JsonSerializer.Serialize(d);

    // ---- public projection: only Published && IsActive, never drafts or internal fields ----
    public IQueryable<ContentItem> PublicQuery() => _db.Content.AsNoTracking().Where(c => c.PublishState == PublishState.Published && c.IsActive);

    public static object ToPublic(ContentItem c, IEnumerable<MediaAsset> media) => new
    {
        c.Id, c.Slug, type = c.Type.ToString(), c.TitleEn, c.TitleBn, c.SummaryEn, c.SummaryBn, c.BodyEn, c.BodyBn,
        c.UpazilaId, c.Category, c.AddressEn, c.AddressBn, c.Latitude, c.Longitude, c.Phone, c.Website, c.Email,
        c.SourceName, c.SourceUrl, c.EventStartUtc, c.EventEndUtc, c.PublishedAtUtc, c.UpdatedAtUtc,
        images = media.Where(m => m.Status == MediaStatus.Approved).OrderByDescending(m => m.IsCover).ThenBy(m => m.CreatedAtUtc)
            .Select(m => new { m.Id, url = "/media/" + m.Id, m.AltEn, m.AltBn, m.Credit, m.Width, m.Height, m.IsCover }),
    };
}

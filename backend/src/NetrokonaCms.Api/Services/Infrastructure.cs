using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Data;
using NetrokonaCms.Api.Domain;
using NetrokonaCms.Api.Dtos;
using NetrokonaCms.Api.Security;

namespace NetrokonaCms.Api.Services;

public class SecurityOptions
{
    /// <summary>Secret used to hash client IPs for audit/duplicate checks (raw IPs are never stored).</summary>
    public string IpHashKey { get; set; } = "";
}

public class RequestInfo
{
    private readonly IHttpContextAccessor _http;
    private readonly byte[] _key;
    public RequestInfo(IHttpContextAccessor http, SecurityOptions opt)
    {
        _http = http;
        _key = Encoding.UTF8.GetBytes(string.IsNullOrEmpty(opt.IpHashKey) ? "dev-only-ip-hash-key-change-me" : opt.IpHashKey);
    }
    public Guid? UserId => _http.HttpContext?.User.Id();
    public string IpHash
    {
        get
        {
            var ip = _http.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            return Convert.ToHexString(HMACSHA256.HashData(_key, Encoding.UTF8.GetBytes(ip)))[..32];
        }
    }
}

public class AuditService
{
    private readonly NetrokonaDbContext _db;
    private readonly RequestInfo _req;
    public AuditService(NetrokonaDbContext db, RequestInfo req) { _db = db; _req = req; }

    /// <summary>Adds an audit row to the current unit of work (saved together with the change it describes).</summary>
    public void Add(string action, string entityType, object? entityId, string? details = null, Guid? userId = null) =>
        _db.AuditLogs.Add(new AuditLog
        {
            UserId = userId ?? _req.UserId, Action = action, EntityType = entityType, EntityId = entityId?.ToString(),
            Details = details, IpHash = _req.IpHash,
        });
}

public static class Text
{
    private static readonly char[] Bn = "০১২৩৪৫৬৭৮৯".ToCharArray();

    public static string NormalizeTitle(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return "";
        var sb = new StringBuilder();
        foreach (var ch in s.Normalize(NormalizationForm.FormC).ToLowerInvariant())
        {
            var i = Array.IndexOf(Bn, ch);
            var c = i >= 0 ? (char)('0' + i) : ch;
            var cat = char.GetUnicodeCategory(c);
            if (char.IsLetterOrDigit(c) || cat is UnicodeCategory.NonSpacingMark or UnicodeCategory.SpacingCombiningMark) sb.Append(c);
            else if (char.IsWhiteSpace(c) && sb.Length > 0 && sb[^1] != ' ') sb.Append(' ');
        }
        return sb.ToString().Trim();
    }

    public static string Slugify(string? s)
    {
        var t = new string((s ?? "").ToLowerInvariant().Select(c => c is >= 'a' and <= 'z' or >= '0' and <= '9' ? c : '-').ToArray());
        while (t.Contains("--")) t = t.Replace("--", "-");
        return t.Trim('-');
    }

    public static string NewTrackingCode()
    {
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // no look-alike characters
        Span<byte> b = stackalloc byte[10];
        RandomNumberGenerator.Fill(b);
        var chars = b.ToArray().Select(x => alphabet[x % alphabet.Length]).ToArray();
        return "NK-" + new string(chars, 0, 5) + "-" + new string(chars, 5, 5);
    }

    public static string NewSecret() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(24)).Replace('+', '-').Replace('/', '_').TrimEnd('=');
    public static string Hash(string s) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(s)));
}

public record DuplicateMatch(double Score, Guid? ContentId, Guid? SubmissionId);

/// <summary>Flags likely duplicates of existing content or other open submissions. Advisory: it informs the
/// reviewer; only an identical re-send from the same client is blocked (see SubmissionService).</summary>
public class DuplicateDetector
{
    private readonly NetrokonaDbContext _db;
    public DuplicateDetector(NetrokonaDbContext db) => _db = db;

    public static double Dice(string a, string b)
    {
        if (a.Length == 0 || b.Length == 0) return 0;
        if (a == b) return 1;
        if (a.Length < 2 || b.Length < 2) return 0;
        var set = new Dictionary<string, int>();
        for (var i = 0; i < a.Length - 1; i++) { var g = a.Substring(i, 2); set[g] = set.GetValueOrDefault(g) + 1; }
        var hits = 0;
        for (var i = 0; i < b.Length - 1; i++)
        {
            var g = b.Substring(i, 2);
            if (set.TryGetValue(g, out var n) && n > 0) { hits++; set[g] = n - 1; }
        }
        return 2.0 * hits / (a.Length + b.Length - 2);
    }

    public static double DistanceMeters(double la1, double lo1, double la2, double lo2)
    {
        const double R = 6371000;
        double Rad(double d) => d * Math.PI / 180;
        var dLa = Rad(la2 - la1); var dLo = Rad(lo2 - lo1);
        var h = Math.Sin(dLa / 2) * Math.Sin(dLa / 2) + Math.Cos(Rad(la1)) * Math.Cos(Rad(la2)) * Math.Sin(dLo / 2) * Math.Sin(dLo / 2);
        return 2 * R * Math.Asin(Math.Sqrt(h));
    }

    public async Task<DuplicateMatch> FindAsync(ContentType type, ContentFields f, Guid? excludeSubmission = null, Guid? excludeContent = null, CancellationToken ct = default)
    {
        var titles = new[] { Text.NormalizeTitle(f.TitleEn), Text.NormalizeTitle(f.TitleBn) }.Where(t => t.Length > 0).ToArray();
        double best = 0; Guid? bestContent = null, bestSub = null;

        var content = await _db.Content.AsNoTracking().Where(c => c.Type == type && c.Id != excludeContent)
            .Select(c => new { c.Id, c.TitleEn, c.TitleBn, c.Latitude, c.Longitude }).Take(2000).ToListAsync(ct);
        foreach (var c in content)
        {
            var s = Score(titles, f, Text.NormalizeTitle(c.TitleEn), Text.NormalizeTitle(c.TitleBn), c.Latitude, c.Longitude);
            if (s > best) { best = s; bestContent = c.Id; bestSub = null; }
        }
        var subs = await _db.Submissions.AsNoTracking()
            .Where(s => s.ContentType == type && s.Id != excludeSubmission && (s.Status == SubmissionStatus.Pending || s.Status == SubmissionStatus.UnderReview || s.Status == SubmissionStatus.NeedsCorrection))
            .Select(s => new { s.Id, s.NormalizedTitle }).Take(2000).ToListAsync(ct);
        foreach (var s in subs)
        {
            var sc = titles.Select(t => Dice(t, s.NormalizedTitle)).DefaultIfEmpty(0).Max();
            if (sc > best) { best = sc; bestSub = s.Id; bestContent = null; }
        }
        return new DuplicateMatch(Math.Round(best, 3), best >= 0.8 ? bestContent : null, best >= 0.8 ? bestSub : null);
    }

    private static double Score(string[] titles, ContentFields f, string t1, string t2, double? la, double? lo)
    {
        var s = titles.SelectMany(t => new[] { Dice(t, t1), Dice(t, t2) }).DefaultIfEmpty(0).Max();
        if (f.Latitude != null && f.Longitude != null && la != null && lo != null
            && DistanceMeters(f.Latitude.Value, f.Longitude.Value, la.Value, lo.Value) < 100 && s >= 0.5)
            s = Math.Max(s, 0.9);   // same place, similar name
        return s;
    }
}

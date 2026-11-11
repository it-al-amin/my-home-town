using System.Security.Cryptography;
using NetrokonaCms.Api.Domain;
using SkiaSharp;

namespace NetrokonaCms.Api.Services;

public class UploadOptions
{
    public string Path { get; set; } = "uploads";          // outside wwwroot: never served as static files
    public long MaxBytes { get; set; } = 5 * 1024 * 1024;
    public int MaxPerSubmission { get; set; } = 5;
    public int MaxEdge { get; set; } = 1920;
    public long MaxPixels { get; set; } = 40_000_000;      // decompression-bomb guard
}

public class UploadRejected : Exception { public UploadRejected(string m) : base(m) { } }

public class UploadService
{
    private static readonly string[] Ext = { ".jpg", ".jpeg", ".png", ".webp" };
    private readonly UploadOptions _o;
    public UploadService(UploadOptions o) { _o = o; Directory.CreateDirectory(Root); }

    public string Root => System.IO.Path.GetFullPath(_o.Path);
    public int MaxPerSubmission => _o.MaxPerSubmission;

    public static string? Sniff(ReadOnlySpan<byte> h)
    {
        if (h.Length >= 3 && h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF) return "jpeg";
        if (h.Length >= 8 && h[0] == 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47) return "png";
        if (h.Length >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F' && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') return "webp";
        return null;
    }

    /// <summary>Validates and re-encodes an uploaded image. Re-encoding discards EXIF/GPS and any appended payload,
    /// and the file is stored under a random name that the client never controls.</summary>
    public async Task<MediaAsset> SaveAsync(IFormFile file, Guid? uploadedBy, CancellationToken ct = default)
    {
        if (file.Length == 0) throw new UploadRejected("The file is empty.");
        if (file.Length > _o.MaxBytes) throw new UploadRejected($"Images may be at most {_o.MaxBytes / 1024 / 1024} MB.");
        var ext = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!Ext.Contains(ext)) throw new UploadRejected("Only JPG, PNG and WebP images are accepted.");

        byte[] raw;
        using (var ms = new MemoryStream((int)file.Length)) { await file.CopyToAsync(ms, ct); raw = ms.ToArray(); }
        var kind = Sniff(raw);
        if (kind is null) throw new UploadRejected("The file is not a valid JPG, PNG or WebP image.");

        using var codec = SKCodec.Create(new MemoryStream(raw)) ?? throw new UploadRejected("The image could not be read.");
        if (codec.Info.Width < 100 || codec.Info.Height < 100) throw new UploadRejected("Images must be at least 100x100 pixels.");
        if ((long)codec.Info.Width * codec.Info.Height > _o.MaxPixels) throw new UploadRejected("The image dimensions are too large.");

        using var bmp = SKBitmap.Decode(codec) ?? throw new UploadRejected("The image could not be decoded.");
        var scale = Math.Min(1.0, (double)_o.MaxEdge / Math.Max(bmp.Width, bmp.Height));
        var w = Math.Max(1, (int)(bmp.Width * scale)); var h = Math.Max(1, (int)(bmp.Height * scale));

        using var surface = SKSurface.Create(new SKImageInfo(w, h, SKColorType.Rgba8888, SKAlphaType.Opaque));
        surface.Canvas.Clear(SKColors.White);                                   // flatten transparency for JPEG
        surface.Canvas.DrawBitmap(bmp, new SKRect(0, 0, w, h), new SKPaint { FilterQuality = SKFilterQuality.Medium });
        using var img = surface.Snapshot();
        using var data = img.Encode(SKEncodedImageFormat.Jpeg, 85);
        var bytes = data.ToArray();

        var stored = Guid.NewGuid().ToString("N") + ".jpg";
        await File.WriteAllBytesAsync(System.IO.Path.Combine(Root, stored), bytes, ct);
        var original = System.IO.Path.GetFileName(file.FileName);
        return new MediaAsset
        {
            StoredName = stored, OriginalName = original.Length > 200 ? original[..200] : original, ContentType = "image/jpeg",
            SizeBytes = bytes.Length, Width = w, Height = h, Sha256 = Convert.ToHexString(SHA256.HashData(bytes)), UploadedBy = uploadedBy,
        };
    }

    public string PathFor(MediaAsset m) => System.IO.Path.Combine(Root, System.IO.Path.GetFileName(m.StoredName));   // GetFileName: no traversal

    public void Delete(MediaAsset m)
    {
        var p = PathFor(m);
        if (File.Exists(p)) File.Delete(p);
    }
}

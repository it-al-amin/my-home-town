using Microsoft.EntityFrameworkCore;
using NetrokonaCms.Api.Domain;

namespace NetrokonaCms.Api.Data;

public class NetrokonaDbContext : DbContext
{
    public NetrokonaDbContext(DbContextOptions<NetrokonaDbContext> options) : base(options) { }

    public DbSet<ContentItem> Content => Set<ContentItem>();
    public DbSet<MediaAsset> Media => Set<MediaAsset>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<ReviewEvent> ReviewEvents => Set<ReviewEvent>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<ContentItem>(e =>
        {
            e.ToTable("Content");
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => new { x.Type, x.PublishState, x.IsActive });
            e.HasIndex(x => x.UpazilaId);
            e.Property(x => x.Slug).HasMaxLength(200).IsRequired();
            e.Property(x => x.TitleEn).HasMaxLength(300);
            e.Property(x => x.TitleBn).HasMaxLength(300);
            e.Property(x => x.NormalizedTitle).HasMaxLength(400);
            e.Property(x => x.SummaryEn).HasMaxLength(1000);
            e.Property(x => x.SummaryBn).HasMaxLength(1000);
            e.Property(x => x.UpazilaId).HasMaxLength(40);
            e.Property(x => x.Category).HasMaxLength(80);
            e.Property(x => x.AddressEn).HasMaxLength(500);
            e.Property(x => x.AddressBn).HasMaxLength(500);
            e.Property(x => x.Phone).HasMaxLength(40);
            e.Property(x => x.Website).HasMaxLength(500);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.SourceName).HasMaxLength(200);
            e.Property(x => x.SourceUrl).HasMaxLength(500);
            e.Property(x => x.Type).HasConversion<string>().HasMaxLength(32);
            e.Property(x => x.PublishState).HasConversion<string>().HasMaxLength(16);
            e.Property(x => x.Version).IsConcurrencyToken();
        });
        b.Entity<MediaAsset>(e =>
        {
            e.ToTable("Media");
            e.HasIndex(x => x.ContentItemId);
            e.HasIndex(x => x.SubmissionId);
            e.Property(x => x.StoredName).HasMaxLength(80).IsRequired();
            e.Property(x => x.OriginalName).HasMaxLength(255);
            e.Property(x => x.ContentType).HasMaxLength(50);
            e.Property(x => x.Sha256).HasMaxLength(64);
            e.Property(x => x.AltEn).HasMaxLength(300);
            e.Property(x => x.AltBn).HasMaxLength(300);
            e.Property(x => x.Credit).HasMaxLength(300);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
            e.HasOne(x => x.ContentItem).WithMany(c => c.Media).HasForeignKey(x => x.ContentItemId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<Submission>(e =>
        {
            e.ToTable("Submissions");
            e.HasIndex(x => x.TrackingCode).IsUnique();
            e.HasIndex(x => new { x.Status, x.CreatedAtUtc });
            e.Property(x => x.TrackingCode).HasMaxLength(20).IsRequired();
            e.Property(x => x.EditTokenHash).HasMaxLength(128);
            e.Property(x => x.SubmitterName).HasMaxLength(150);
            e.Property(x => x.SubmitterEmail).HasMaxLength(256);
            e.Property(x => x.SubmitterPhone).HasMaxLength(40);
            e.Property(x => x.Message).HasMaxLength(2000);
            e.Property(x => x.PublicNote).HasMaxLength(2000);
            e.Property(x => x.ClientIpHash).HasMaxLength(64);
            e.Property(x => x.NormalizedTitle).HasMaxLength(400);
            e.Property(x => x.PayloadJson).HasColumnType("longtext");
            e.Property(x => x.Kind).HasConversion<string>().HasMaxLength(16);
            e.Property(x => x.ContentType).HasConversion<string>().HasMaxLength(32);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(16);
            e.Property(x => x.Version).IsConcurrencyToken();
        });
        b.Entity<ReviewEvent>(e =>
        {
            e.ToTable("ReviewEvents");
            e.HasIndex(x => x.SubmissionId);
            e.Property(x => x.InternalRemark).HasMaxLength(2000);
            e.Property(x => x.PublicNote).HasMaxLength(2000);
            e.Property(x => x.FromStatus).HasConversion<string>().HasMaxLength(16);
            e.Property(x => x.ToStatus).HasConversion<string>().HasMaxLength(16);
            e.HasOne<Submission>().WithMany(s => s.Events).HasForeignKey(x => x.SubmissionId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<AuditLog>(e =>
        {
            e.ToTable("AuditLogs");
            e.HasIndex(x => x.AtUtc);
            e.HasIndex(x => new { x.EntityType, x.EntityId });
            e.Property(x => x.Action).HasMaxLength(80);
            e.Property(x => x.EntityType).HasMaxLength(60);
            e.Property(x => x.EntityId).HasMaxLength(64);
            e.Property(x => x.Details).HasColumnType("longtext");
            e.Property(x => x.IpHash).HasMaxLength(64);
        });
    }
}

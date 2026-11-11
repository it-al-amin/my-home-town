using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SharedIdentity.Core;

/// <summary>Lets `dotnet ef migrations add` run without a live MySQL server.</summary>
public class DesignTimeFactory : IDesignTimeDbContextFactory<SharedIdentityDbContext>
{
    public SharedIdentityDbContext CreateDbContext(string[] args)
    {
        var o = new DbContextOptionsBuilder<SharedIdentityDbContext>();
        ServiceCollectionExtensions.Configure(o, "Server=localhost;Database=shared_identity;User=design;Password=design", "MySql");
        return new SharedIdentityDbContext(o.Options);
    }
}

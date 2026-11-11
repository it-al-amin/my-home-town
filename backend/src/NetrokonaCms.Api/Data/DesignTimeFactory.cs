using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NetrokonaCms.Api.Data;

/// <summary>Lets `dotnet ef migrations add` run without a live MySQL server.</summary>
public class NetrokonaDesignTimeFactory : IDesignTimeDbContextFactory<NetrokonaDbContext>
{
    public NetrokonaDbContext CreateDbContext(string[] args) =>
        new(new DbContextOptionsBuilder<NetrokonaDbContext>()
            .UseMySql("Server=localhost;Database=netrokona_cms;User=design;Password=design", new MySqlServerVersion(new Version(8, 0, 36))).Options);
}

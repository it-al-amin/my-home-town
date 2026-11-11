using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SharedIdentity.Core;

public static class ServiceCollectionExtensions
{
    /// <summary>Registers the shared identity database + services. Provider "MySql" (default) or "Sqlite" (tests/dev).</summary>
    public static IServiceCollection AddSharedIdentity(this IServiceCollection services, string connectionString,
        string provider = "MySql", Action<SharedIdentityOptions>? configure = null)
    {
        var opt = new SharedIdentityOptions();
        configure?.Invoke(opt);
        services.AddSingleton(opt);
        services.AddDbContext<SharedIdentityDbContext>(o => Configure(o, connectionString, provider));
        services.AddScoped<IdentityService>();
        services.AddScoped<ApplicationAccessService>();
        return services;
    }

    /// <summary>Same as above but resolves settings from the built service provider (final configuration).</summary>
    public static IServiceCollection AddSharedIdentity(this IServiceCollection services,
        Func<IServiceProvider, (string ConnectionString, string Provider, Action<SharedIdentityOptions>? Configure)> resolve)
    {
        services.AddSingleton(sp => { var o = new SharedIdentityOptions(); resolve(sp).Configure?.Invoke(o); return o; });
        services.AddDbContext<SharedIdentityDbContext>((sp, o) => { var r = resolve(sp); Configure(o, r.ConnectionString, r.Provider); });
        services.AddScoped<IdentityService>();
        services.AddScoped<ApplicationAccessService>();
        return services;
    }

    public static void Configure(DbContextOptionsBuilder o, string cs, string provider)
    {
        if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase)) o.UseSqlite(cs);
        else o.UseMySql(cs, new MySqlServerVersion(new Version(8, 0, 36)),
                m => m.MigrationsAssembly(typeof(SharedIdentityDbContext).Assembly.FullName));
    }
}

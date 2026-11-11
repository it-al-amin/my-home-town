using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SharedIdentity.Core;

// Central identity administration. Global accounts are created HERE (or by a future central login service),
// never inside an individual application.
//   SHARED_IDENTITY_CONNECTION   connection string (required)
//   SHARED_IDENTITY_PROVIDER     MySql (default) | Sqlite
//   IDENTITY_NEW_PASSWORD        password for create-user (otherwise prompted)

var conn = Environment.GetEnvironmentVariable("SHARED_IDENTITY_CONNECTION");
if (string.IsNullOrWhiteSpace(conn) || args.Length == 0) { Usage(); return 1; }

var services = new ServiceCollection()
    .AddSharedIdentity(conn, Environment.GetEnvironmentVariable("SHARED_IDENTITY_PROVIDER") ?? "MySql", o => o.RequireConfirmedEmail = true)
    .BuildServiceProvider();
using var scope = services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<SharedIdentityDbContext>();
var ids = scope.ServiceProvider.GetRequiredService<IdentityService>();
var access = scope.ServiceProvider.GetRequiredService<ApplicationAccessService>();

string Opt(string name, bool required = true)
{
    var i = Array.IndexOf(args, "--" + name);
    if (i >= 0 && i + 1 < args.Length) return args[i + 1];
    if (required) throw new ArgumentException($"Missing --{name}");
    return "";
}

try
{
    switch (args[0])
    {
        case "migrate":
            await db.Database.MigrateAsync();
            Console.WriteLine("Shared identity database is up to date.");
            break;
        case "create-user":
            var pw = Environment.GetEnvironmentVariable("IDENTITY_NEW_PASSWORD");
            if (string.IsNullOrEmpty(pw)) { Console.Write("Password: "); pw = ReadSecret(); }
            var u = await ids.CreateUserAsync(Opt("name"), Opt("email"), pw!, Opt("phone", false) is { Length: > 0 } p ? p : null,
                emailConfirmed: args.Contains("--confirmed"));
            Console.WriteLine($"Created global user {u.Id} ({u.Email}). Email confirmed: {u.EmailConfirmed}");
            break;
        case "grant":   // assign an EXISTING user to an application with a role
            var user = await ids.FindByEmailAsync(Opt("email")) ?? throw new KeyNotFoundException("No global user with that email.");
            var app = Opt("app");
            var added = await access.AssignUserAsync(app, user.Id, null);
            var current = (await access.GetAccessAsync(app, user.Id))?.Roles ?? new List<string>();
            await access.SetUserRolesAsync(app, user.Id, current.Append(Opt("role")).Distinct(), null);
            Console.WriteLine($"{user.Email}: {(added ? "assigned to" : "already in")} '{app}', roles now: {string.Join(", ", (await access.GetAccessAsync(app, user.Id))!.Roles)}");
            break;
        case "members":
            foreach (var m in await access.ListMembersAsync(Opt("app")))
                Console.WriteLine($"{m.Email,-34} active={m.MembershipActive,-5} roles=[{string.Join(", ", m.Roles)}]");
            break;
        default: Usage(); return 1;
    }
    return 0;
}
catch (Exception e) when (e is ArgumentException or InvalidOperationException or KeyNotFoundException)
{
    Console.Error.WriteLine("error: " + e.Message);
    return 2;
}

static string ReadSecret()
{
    var sb = new System.Text.StringBuilder();
    ConsoleKeyInfo k;
    while ((k = Console.ReadKey(true)).Key != ConsoleKey.Enter)
    {
        if (k.Key == ConsoleKey.Backspace && sb.Length > 0) sb.Length--;
        else if (!char.IsControl(k.KeyChar)) sb.Append(k.KeyChar);
    }
    Console.WriteLine();
    return sb.ToString();
}

static void Usage() => Console.WriteLine("""
    Shared identity admin. Set SHARED_IDENTITY_CONNECTION first.
      migrate
      create-user --name "Full Name" --email a@b.com [--phone N] [--confirmed]   (password via IDENTITY_NEW_PASSWORD or prompt)
      grant --app netrokona --email a@b.com --role SuperAdmin                     (user must already exist; app must be registered)
      members --app netrokona
    """);

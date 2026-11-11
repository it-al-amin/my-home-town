using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SharedIdentity.Core;

namespace SharedIdentity.Tests;

public class IdentityTests : IDisposable
{
    private readonly SqliteConnection _conn = new("DataSource=:memory:");
    private readonly SharedIdentityDbContext _db;
    private readonly IdentityService _ids;
    private readonly ApplicationAccessService _acc;

    static readonly ApplicationDefinition Netrokona = new("netrokona", "Netrokona",
        new[] { ("content.edit", "Edit"), ("users.manage", "Users") },
        new[] { new RoleDefinition("SuperAdmin", "all", new[] { "content.edit", "users.manage" }),
                new RoleDefinition("Editor", "edit", new[] { "content.edit" }) });
    static readonly ApplicationDefinition Other = new("other-app", "Other",
        new[] { ("orders.view", "View") },
        new[] { new RoleDefinition("SuperAdmin", "all", new[] { "orders.view" }) });

    public IdentityTests()
    {
        _conn.Open();
        _db = new SharedIdentityDbContext(new DbContextOptionsBuilder<SharedIdentityDbContext>().UseSqlite(_conn).Options);
        _db.Database.EnsureCreated();
        _ids = new IdentityService(_db, new SharedIdentityOptions { RequireConfirmedEmail = true });
        _acc = new ApplicationAccessService(_db);
        _acc.EnsureApplicationAsync(Netrokona).Wait();
        _acc.EnsureApplicationAsync(Other).Wait();
    }
    public void Dispose() { _db.Dispose(); _conn.Dispose(); }

    private Task<User> NewUser(string email = "a@example.com", bool confirmed = true) =>
        _ids.CreateUserAsync("Test User", email, "Str0ng-Passw0rd", emailConfirmed: confirmed);

    [Fact]
    public async Task Duplicate_global_account_is_rejected_case_insensitively()
    {
        await NewUser("a@example.com");
        await Assert.ThrowsAsync<InvalidOperationException>(() => NewUser("A@Example.com"));
        Assert.Equal(1, await _db.Users.CountAsync());
    }

    [Fact]
    public async Task Password_hash_is_aspnet_identity_compatible_and_weak_passwords_rejected()
    {
        var u = await NewUser();
        Assert.NotEqual(PasswordVerificationResult.Failed, new PasswordHasher<User>().VerifyHashedPassword(u, u.PasswordHash, "Str0ng-Passw0rd"));
        await Assert.ThrowsAsync<ArgumentException>(() => _ids.CreateUserAsync("x", "b@example.com", "weak"));
    }

    [Fact]
    public async Task Assigning_an_existing_user_is_idempotent_and_creates_no_new_user()
    {
        var u = await NewUser();
        Assert.True(await _acc.AssignUserAsync("netrokona", u.Id, null));
        Assert.False(await _acc.AssignUserAsync("netrokona", u.Id, null));
        Assert.Equal(1, await _db.UserApplications.CountAsync());
        Assert.Equal(1, await _db.Users.CountAsync());
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _acc.AssignUserAsync("netrokona", Guid.NewGuid(), null));
        Assert.Equal(1, await _db.Users.CountAsync());   // unknown id does NOT create an account
    }

    [Fact]
    public async Task Roles_and_permissions_never_cross_applications()
    {
        var u = await NewUser();
        await _acc.AssignUserAsync("netrokona", u.Id, null);
        await _acc.SetUserRolesAsync("netrokona", u.Id, new[] { "SuperAdmin" }, null);

        var n = await _acc.GetAccessAsync("netrokona", u.Id);
        Assert.Contains("users.manage", n!.Permissions);
        Assert.Null(await _acc.GetAccessAsync("other-app", u.Id));          // SuperAdmin here != access there

        await _acc.AssignUserAsync("other-app", u.Id, null);
        var o = await _acc.GetAccessAsync("other-app", u.Id);
        Assert.Empty(o!.Roles);                                              // membership alone grants no role
        Assert.DoesNotContain("content.edit", o.Permissions);
        await Assert.ThrowsAsync<ArgumentException>(() => _acc.SetUserRolesAsync("other-app", u.Id, new[] { "Editor" }, null)); // Editor is a netrokona role
    }

    [Fact]
    public async Task Roles_require_membership()
    {
        var u = await NewUser();
        await Assert.ThrowsAsync<InvalidOperationException>(() => _acc.SetUserRolesAsync("netrokona", u.Id, new[] { "Editor" }, null));
    }

    [Fact]
    public async Task Removing_from_one_app_keeps_the_account_and_other_apps()
    {
        var u = await NewUser();
        foreach (var app in new[] { "netrokona", "other-app" }) { await _acc.AssignUserAsync(app, u.Id, null); await _acc.SetUserRolesAsync(app, u.Id, new[] { "SuperAdmin" }, null); }
        var spare = await NewUser("spare@example.com");   // so netrokona keeps a second SuperAdmin
        await _acc.AssignUserAsync("netrokona", spare.Id, null);
        await _acc.SetUserRolesAsync("netrokona", spare.Id, new[] { "SuperAdmin" }, null);

        await _acc.RemoveUserAsync("netrokona", u.Id);
        Assert.Null(await _acc.GetAccessAsync("netrokona", u.Id));
        Assert.NotNull(await _acc.GetAccessAsync("other-app", u.Id));
        Assert.NotNull(await _ids.FindByIdAsync(u.Id));
    }

    [Fact]
    public async Task Last_superadmin_cannot_be_removed_or_demoted()
    {
        var u = await NewUser();
        await _acc.AssignUserAsync("netrokona", u.Id, null);
        await _acc.SetUserRolesAsync("netrokona", u.Id, new[] { "SuperAdmin" }, null);
        await Assert.ThrowsAsync<InvalidOperationException>(() => _acc.SetUserRolesAsync("netrokona", u.Id, new[] { "Editor" }, null));
        await Assert.ThrowsAsync<InvalidOperationException>(() => _acc.RemoveUserAsync("netrokona", u.Id));
    }

    [Fact]
    public async Task Authentication_enforces_membership_confirmation_active_and_lockout()
    {
        var u = await NewUser();
        var wrong = await _ids.AuthenticateAsync("netrokona", u.Email, "nope", _acc);
        Assert.Equal(AuthFailure.InvalidCredentials, wrong.Failure);
        Assert.Equal(AuthFailure.NoApplicationAccess, (await _ids.AuthenticateAsync("netrokona", u.Email, "Str0ng-Passw0rd", _acc)).Failure);

        await _acc.AssignUserAsync("netrokona", u.Id, null);
        await _acc.SetUserRolesAsync("netrokona", u.Id, new[] { "Editor" }, null);
        var ok = await _ids.AuthenticateAsync("netrokona", "A@EXAMPLE.COM", "Str0ng-Passw0rd", _acc);
        Assert.True(ok.Succeeded);
        Assert.Contains("content.edit", ok.Access!.Permissions);

        var unconfirmed = await NewUser("u2@example.com", confirmed: false);
        await _acc.AssignUserAsync("netrokona", unconfirmed.Id, null);
        Assert.Equal(AuthFailure.EmailNotConfirmed, (await _ids.AuthenticateAsync("netrokona", unconfirmed.Email, "Str0ng-Passw0rd", _acc)).Failure);

        for (var i = 0; i < 5; i++) await _ids.AuthenticateAsync("netrokona", u.Email, "bad", _acc);
        Assert.Equal(AuthFailure.LockedOut, (await _ids.AuthenticateAsync("netrokona", u.Email, "Str0ng-Passw0rd", _acc)).Failure);   // even with the right password
    }

    [Fact]
    public async Task Inactive_global_user_loses_access_everywhere()
    {
        var u = await NewUser();
        await _acc.AssignUserAsync("netrokona", u.Id, null);
        (await _db.Users.FindAsync(u.Id))!.IsActive = false;
        await _db.SaveChangesAsync();
        Assert.Null(await _acc.GetAccessAsync("netrokona", u.Id));
        Assert.Equal(AuthFailure.Inactive, (await _ids.AuthenticateAsync("netrokona", u.Email, "Str0ng-Passw0rd", _acc)).Failure);
    }

    [Fact]
    public async Task SuperAdmin_gets_new_permissions_and_role_permissions_are_editable_per_app()
    {
        var more = Netrokona with { Permissions = Netrokona.Permissions.Append(("media.manage", "Media")).ToArray() };
        await _acc.EnsureApplicationAsync(more);
        Assert.Contains("media.manage", (await _acc.ListRolesAsync("netrokona")).First(r => r.Name == "SuperAdmin").Permissions);

        await _acc.SetRolePermissionsAsync("netrokona", "Editor", new[] { "content.edit", "media.manage" });
        Assert.Contains("media.manage", (await _acc.ListRolesAsync("netrokona")).First(r => r.Name == "Editor").Permissions);
        await Assert.ThrowsAsync<ArgumentException>(() => _acc.SetRolePermissionsAsync("netrokona", "Editor", new[] { "orders.view" })); // other app's permission
        await Assert.ThrowsAsync<InvalidOperationException>(() => _acc.SetRolePermissionsAsync("netrokona", "SuperAdmin", new[] { "content.edit" }));
        Assert.DoesNotContain("media.manage", (await _acc.ListRolesAsync("other-app")).SelectMany(r => r.Permissions));
    }

    [Fact]
    public async Task EnsureApplication_is_idempotent()
    {
        await _acc.EnsureApplicationAsync(Netrokona);
        await _acc.EnsureApplicationAsync(Netrokona);
        Assert.Equal(1, await _db.Applications.CountAsync(a => a.Key == "netrokona"));
        Assert.Equal(2, await _db.Roles.CountAsync(r => r.Application!.Key == "netrokona"));
    }
}

using Microsoft.EntityFrameworkCore;

namespace SharedIdentity.Core;

public record RoleDefinition(string Name, string Description, string[] Permissions);
public record ApplicationDefinition(string Key, string Name, (string Key, string Description)[] Permissions, RoleDefinition[] Roles);

public record MemberView(Guid UserId, string FullName, string Email, bool UserActive, bool MembershipActive, string[] Roles);

/// <summary>Application-scoped access management. Every operation takes the application key and can only
/// see or change that application's membership, roles and permissions.</summary>
public class ApplicationAccessService
{
    private readonly SharedIdentityDbContext _db;
    public ApplicationAccessService(SharedIdentityDbContext db) => _db = db;

    /// <summary>Idempotent: creates the application, its permissions and its system roles if missing, and
    /// adds any missing role->permission links. Never removes or overrides links an admin has customised.</summary>
    public async Task EnsureApplicationAsync(ApplicationDefinition def, CancellationToken ct = default)
    {
        var app = await _db.Applications.FirstOrDefaultAsync(a => a.Key == def.Key, ct);
        if (app is null) { app = new Application { Key = def.Key, Name = def.Name }; _db.Applications.Add(app); await _db.SaveChangesAsync(ct); }

        var perms = await _db.Permissions.Where(p => p.ApplicationId == app.Id).ToListAsync(ct);
        foreach (var (key, desc) in def.Permissions)
            if (perms.All(p => p.Key != key)) { var p = new Permission { ApplicationId = app.Id, Key = key, Description = desc }; _db.Permissions.Add(p); perms.Add(p); }
        await _db.SaveChangesAsync(ct);

        var roles = await _db.Roles.Include(r => r.RolePermissions).Where(r => r.ApplicationId == app.Id).ToListAsync(ct);
        foreach (var rd in def.Roles)
        {
            var role = roles.FirstOrDefault(r => r.Name == rd.Name);
            if (role is null)
            {
                role = new Role { ApplicationId = app.Id, Name = rd.Name, Description = rd.Description, IsSystem = true };
                _db.Roles.Add(role);
                foreach (var pk in rd.Permissions) role.RolePermissions.Add(new RolePermission { Role = role, PermissionId = perms.First(p => p.Key == pk).Id });
            }
        }
        await _db.SaveChangesAsync(ct);

        // SuperAdmin always holds every permission, including ones added by later releases.
        var sa = roles.FirstOrDefault(r => r.Name == "SuperAdmin") ?? await _db.Roles.Include(r => r.RolePermissions).FirstOrDefaultAsync(r => r.ApplicationId == app.Id && r.Name == "SuperAdmin", ct);
        if (sa != null)
        {
            var have = (await _db.RolePermissions.Where(rp => rp.RoleId == sa.Id).Select(rp => rp.PermissionId).ToListAsync(ct)).ToHashSet();
            foreach (var p in perms.Where(p => !have.Contains(p.Id))) _db.RolePermissions.Add(new RolePermission { RoleId = sa.Id, PermissionId = p.Id });
            await _db.SaveChangesAsync(ct);
        }
    }

    private async Task<Application> RequireAppAsync(string appKey, CancellationToken ct) =>
        await _db.Applications.FirstOrDefaultAsync(a => a.Key == appKey, ct) ?? throw new InvalidOperationException($"Unknown application '{appKey}'.");

    /// <summary>Access of a user to ONE application, or null if the user/app/membership is inactive.</summary>
    public async Task<AppAccess?> GetAccessAsync(string appKey, Guid userId, CancellationToken ct = default)
    {
        var app = await _db.Applications.AsNoTracking().FirstOrDefaultAsync(a => a.Key == appKey && a.IsActive, ct);
        if (app is null) return null;
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId && u.IsActive, ct);
        if (user is null) return null;
        var member = await _db.UserApplications.AsNoTracking().AnyAsync(m => m.UserId == userId && m.ApplicationId == app.Id && m.IsActive, ct);
        if (!member) return null;

        var roles = await _db.UserRoles.AsNoTracking().Where(ur => ur.UserId == userId && ur.Role!.ApplicationId == app.Id)
            .Select(ur => ur.Role!.Name).ToListAsync(ct);
        var perms = await _db.UserRoles.AsNoTracking().Where(ur => ur.UserId == userId && ur.Role!.ApplicationId == app.Id)
            .SelectMany(ur => ur.Role!.RolePermissions.Select(rp => rp.Permission!.Key)).Distinct().ToListAsync(ct);
        return new AppAccess(user.Id, user.FullName, user.Email, user.SecurityStamp, roles, perms.ToHashSet());
    }

    /// <summary>Gives an EXISTING global user access to the application. Never creates a user; idempotent
    /// (re-assigning re-activates, it does not duplicate).</summary>
    public async Task<bool> AssignUserAsync(string appKey, Guid userId, Guid? grantedBy, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        if (!await _db.Users.AnyAsync(u => u.Id == userId, ct)) throw new KeyNotFoundException("No such global user.");
        var m = await _db.UserApplications.FirstOrDefaultAsync(x => x.UserId == userId && x.ApplicationId == app.Id, ct);
        if (m is null)
        {
            _db.UserApplications.Add(new UserApplication { UserId = userId, ApplicationId = app.Id, GrantedByUserId = grantedBy });
            await _db.SaveChangesAsync(ct);
            return true;     // newly assigned
        }
        if (!m.IsActive) { m.IsActive = true; m.GrantedByUserId = grantedBy; m.GrantedAtUtc = DateTime.UtcNow; await _db.SaveChangesAsync(ct); return true; }
        return false;        // already a member: nothing duplicated
    }

    /// <summary>Removes the user from THIS application only: deactivates membership and drops this app's roles.
    /// The global account and access to other applications are untouched.</summary>
    public async Task RemoveUserAsync(string appKey, Guid userId, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        await GuardLastSuperAdminAsync(app, userId, null, ct);
        var m = await _db.UserApplications.FirstOrDefaultAsync(x => x.UserId == userId && x.ApplicationId == app.Id, ct)
                ?? throw new KeyNotFoundException("User is not assigned to this application.");
        m.IsActive = false;
        var urs = await _db.UserRoles.Where(ur => ur.UserId == userId && ur.Role!.ApplicationId == app.Id).ToListAsync(ct);
        _db.UserRoles.RemoveRange(urs);
        await _db.SaveChangesAsync(ct);
    }

    /// <summary>Replaces the user's roles within this application. Roles are looked up by name inside the app,
    /// so a role of another application can never be assigned.</summary>
    public async Task SetUserRolesAsync(string appKey, Guid userId, IEnumerable<string> roleNames, Guid? assignedBy, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        var names = roleNames.Distinct().ToList();
        if (!await _db.UserApplications.AnyAsync(m => m.UserId == userId && m.ApplicationId == app.Id && m.IsActive, ct))
            throw new InvalidOperationException("Assign the user to the application before giving roles.");
        var roles = await _db.Roles.Where(r => r.ApplicationId == app.Id && names.Contains(r.Name)).ToListAsync(ct);
        var unknown = names.Except(roles.Select(r => r.Name)).ToList();
        if (unknown.Count > 0) throw new ArgumentException("Unknown role(s) for this application: " + string.Join(", ", unknown));
        await GuardLastSuperAdminAsync(app, userId, names, ct);

        var current = await _db.UserRoles.Where(ur => ur.UserId == userId && ur.Role!.ApplicationId == app.Id).ToListAsync(ct);
        _db.UserRoles.RemoveRange(current.Where(c => roles.All(r => r.Id != c.RoleId)));
        foreach (var r in roles.Where(r => current.All(c => c.RoleId != r.Id)))
            _db.UserRoles.Add(new UserRole { UserId = userId, RoleId = r.Id, AssignedByUserId = assignedBy });
        await _db.SaveChangesAsync(ct);
    }

    /// <summary>Prevents locking everyone out: the last active SuperAdmin of an application cannot lose the role.</summary>
    private async Task GuardLastSuperAdminAsync(Application app, Guid userId, IEnumerable<string>? newRoles, CancellationToken ct)
    {
        if (newRoles != null && newRoles.Contains("SuperAdmin")) return;
        var holders = await _db.UserRoles.Where(ur => ur.Role!.ApplicationId == app.Id && ur.Role.Name == "SuperAdmin"
            && _db.UserApplications.Any(m => m.UserId == ur.UserId && m.ApplicationId == app.Id && m.IsActive)).Select(ur => ur.UserId).ToListAsync(ct);
        if (holders.Contains(userId) && holders.Count == 1)
            throw new InvalidOperationException("The last SuperAdmin of this application cannot be removed or demoted.");
    }

    public async Task<List<MemberView>> ListMembersAsync(string appKey, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        var members = await _db.UserApplications.AsNoTracking().Where(m => m.ApplicationId == app.Id)
            .Select(m => new { m.UserId, m.User!.FullName, m.User.Email, UserActive = m.User.IsActive, m.IsActive }).ToListAsync(ct);
        var roles = await _db.UserRoles.AsNoTracking().Where(ur => ur.Role!.ApplicationId == app.Id)
            .Select(ur => new { ur.UserId, ur.Role!.Name }).ToListAsync(ct);
        return members.Select(m => new MemberView(m.UserId, m.FullName, m.Email, m.UserActive, m.IsActive,
            roles.Where(r => r.UserId == m.UserId).Select(r => r.Name).OrderBy(x => x).ToArray())).OrderBy(m => m.Email).ToList();
    }

    public async Task<List<(string Name, string[] Permissions, bool IsSystem)>> ListRolesAsync(string appKey, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        var rows = await _db.Roles.AsNoTracking().Where(r => r.ApplicationId == app.Id)
            .Select(r => new { r.Name, r.IsSystem, Perms = r.RolePermissions.Select(rp => rp.Permission!.Key).ToList() }).ToListAsync(ct);
        return rows.OrderBy(r => r.Name).Select(r => (r.Name, r.Perms.OrderBy(p => p).ToArray(), r.IsSystem)).ToList();
    }

    public async Task<List<string>> ListPermissionsAsync(string appKey, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        return await _db.Permissions.AsNoTracking().Where(p => p.ApplicationId == app.Id).Select(p => p.Key).OrderBy(k => k).ToListAsync(ct);
    }

    /// <summary>Replaces a role's permission set within this application only.</summary>
    public async Task SetRolePermissionsAsync(string appKey, string roleName, IEnumerable<string> permissionKeys, CancellationToken ct = default)
    {
        var app = await RequireAppAsync(appKey, ct);
        var role = await _db.Roles.Include(r => r.RolePermissions).FirstOrDefaultAsync(r => r.ApplicationId == app.Id && r.Name == roleName, ct)
                   ?? throw new KeyNotFoundException("Unknown role for this application.");
        if (role.Name == "SuperAdmin") throw new InvalidOperationException("SuperAdmin always holds every permission and cannot be edited.");
        var keys = permissionKeys.Distinct().ToList();
        var perms = await _db.Permissions.Where(p => p.ApplicationId == app.Id && keys.Contains(p.Key)).ToListAsync(ct);
        var unknown = keys.Except(perms.Select(p => p.Key)).ToList();
        if (unknown.Count > 0) throw new ArgumentException("Unknown permission(s) for this application: " + string.Join(", ", unknown));
        _db.RolePermissions.RemoveRange(role.RolePermissions);
        foreach (var p in perms) _db.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = p.Id });
        await _db.SaveChangesAsync(ct);
    }
}

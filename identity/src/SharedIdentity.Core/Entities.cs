namespace SharedIdentity.Core;

/// <summary>Global user account. The ONE source of truth for identity across all applications.
/// PasswordHash uses the ASP.NET Core Identity v3 format, so any app using ASP.NET Identity can read it.</summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string NormalizedEmail { get; set; } = "";
    public string? PhoneNumber { get; set; }
    public string PasswordHash { get; set; } = "";
    public string? ProfileImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailConfirmed { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    public int AccessFailedCount { get; set; }
    public DateTime? LockoutEndUtc { get; set; }
    /// <summary>Rotated on password change / forced sign-out; apps compare it to end old sessions.</summary>
    public string SecurityStamp { get; set; } = Guid.NewGuid().ToString("N");
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAtUtc { get; set; }
}

/// <summary>A consuming application (e.g. "netrokona"). Roles/permissions never cross application boundaries.</summary>
public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Key { get; set; } = "";
    public string Name { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

/// <summary>Membership: this existing user may use this application. Composite key => no duplicates.</summary>
public class UserApplication
{
    public Guid UserId { get; set; }
    public Guid ApplicationId { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? GrantedByUserId { get; set; }
    public DateTime GrantedAtUtc { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
    public Application? Application { get; set; }
}

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsSystem { get; set; }
    public Application? Application { get; set; }
    public List<RolePermission> RolePermissions { get; set; } = new();
}

public class UserRole
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public Guid? AssignedByUserId { get; set; }
    public DateTime AssignedAtUtc { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
    public Role? Role { get; set; }
}

public class Permission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public string Key { get; set; } = "";
    public string? Description { get; set; }
    public Application? Application { get; set; }
}

public class RolePermission
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    public Role? Role { get; set; }
    public Permission? Permission { get; set; }
}

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SharedIdentity.Core;

public record AppAccess(Guid UserId, string FullName, string Email, string SecurityStamp,
    IReadOnlyList<string> Roles, IReadOnlySet<string> Permissions);

public enum AuthFailure { None, InvalidCredentials, LockedOut, Inactive, EmailNotConfirmed, NoApplicationAccess }

public record AuthResult(AuthFailure Failure, AppAccess? Access)
{
    public bool Succeeded => Failure == AuthFailure.None;
}

public class SharedIdentityOptions
{
    public int MaxFailedAttempts { get; set; } = 5;
    public TimeSpan LockoutDuration { get; set; } = TimeSpan.FromMinutes(15);
    public bool RequireConfirmedEmail { get; set; } = true;
    public int MinPasswordLength { get; set; } = 10;
}

/// <summary>Global user directory + credential verification. The only code that touches Users/PasswordHash.</summary>
public class IdentityService
{
    private readonly SharedIdentityDbContext _db;
    private readonly SharedIdentityOptions _opt;
    private readonly PasswordHasher<User> _hasher = new();

    public IdentityService(SharedIdentityDbContext db, SharedIdentityOptions opt) { _db = db; _opt = opt; }

    public static string Normalize(string email) => email.Trim().ToUpperInvariant();

    /// <summary>Creates a GLOBAL account. Used by central identity tooling, never by an individual application.</summary>
    public async Task<User> CreateUserAsync(string fullName, string email, string password, string? phone = null,
        bool emailConfirmed = false, CancellationToken ct = default)
    {
        if (!new EmailAddressAttribute().IsValid(email)) throw new ArgumentException("Invalid email address.");
        if (string.IsNullOrWhiteSpace(fullName)) throw new ArgumentException("Full name is required.");
        ValidatePassword(password);
        var norm = Normalize(email);
        if (await _db.Users.AnyAsync(u => u.NormalizedEmail == norm, ct))
            throw new InvalidOperationException("A global account with this email already exists.");
        var user = new User { FullName = fullName.Trim(), Email = email.Trim(), NormalizedEmail = norm, PhoneNumber = phone, EmailConfirmed = emailConfirmed };
        user.PasswordHash = _hasher.HashPassword(user, password);
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
        return user;
    }

    public void ValidatePassword(string password)
    {
        if (password.Length < _opt.MinPasswordLength || !password.Any(char.IsUpper) || !password.Any(char.IsLower) || !password.Any(char.IsDigit))
            throw new ArgumentException($"Password needs at least {_opt.MinPasswordLength} characters with upper-case, lower-case and a digit.");
    }

    public Task<User?> FindByEmailAsync(string email, CancellationToken ct = default) =>
        _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.NormalizedEmail == Normalize(email), ct);

    public Task<User?> FindByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct);

    /// <summary>Display info for audit screens: resolved from the shared DB, never copied into app databases.</summary>
    public async Task<Dictionary<Guid, (string Name, string Email)>> GetDisplayAsync(IEnumerable<Guid> ids, CancellationToken ct = default)
    {
        var set = ids.Distinct().ToList();
        return await _db.Users.AsNoTracking().Where(u => set.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => (u.FullName, u.Email), ct);
    }

    public async Task ChangePasswordAsync(Guid userId, string newPassword, CancellationToken ct = default)
    {
        ValidatePassword(newPassword);
        var u = await _db.Users.FirstAsync(x => x.Id == userId, ct);
        u.PasswordHash = _hasher.HashPassword(u, newPassword);
        u.SecurityStamp = Guid.NewGuid().ToString("N");   // signs the user out of every application
        u.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    /// <summary>Verifies credentials against the shared user table, then requires membership of <paramref name="appKey"/>.</summary>
    public async Task<AuthResult> AuthenticateAsync(string appKey, string email, string password, ApplicationAccessService access, CancellationToken ct = default)
    {
        var norm = Normalize(email);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == norm, ct);
        if (user is null)
        {
            // equalise timing so unknown emails are not distinguishable from wrong passwords
            _hasher.VerifyHashedPassword(new User(), _dummyHash, password);
            return new AuthResult(AuthFailure.InvalidCredentials, null);
        }
        if (user.LockoutEndUtc is { } end && end > DateTime.UtcNow) return new AuthResult(AuthFailure.LockedOut, null);

        var ok = _hasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (ok == PasswordVerificationResult.Failed)
        {
            user.AccessFailedCount++;
            if (user.AccessFailedCount >= _opt.MaxFailedAttempts)
            {
                user.LockoutEndUtc = DateTime.UtcNow + _opt.LockoutDuration;
                user.AccessFailedCount = 0;
            }
            await _db.SaveChangesAsync(ct);
            return new AuthResult(AuthFailure.InvalidCredentials, null);
        }
        if (!user.IsActive) return new AuthResult(AuthFailure.Inactive, null);
        if (_opt.RequireConfirmedEmail && !user.EmailConfirmed) return new AuthResult(AuthFailure.EmailNotConfirmed, null);

        var acc = await access.GetAccessAsync(appKey, user.Id, ct);
        if (acc is null) return new AuthResult(AuthFailure.NoApplicationAccess, null);

        user.AccessFailedCount = 0;
        user.LockoutEndUtc = null;
        user.LastLoginAtUtc = DateTime.UtcNow;
        if (ok == PasswordVerificationResult.SuccessRehashNeeded) user.PasswordHash = _hasher.HashPassword(user, password);
        await _db.SaveChangesAsync(ct);
        return new AuthResult(AuthFailure.None, acc);
    }

    private static readonly string _dummyHash = new PasswordHasher<User>().HashPassword(new User(), "Dummy-Password-1");
}

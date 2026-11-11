# Shared identity (single source of truth for user accounts)

One database and one `Users` table shared by **all** your applications. Applications never copy accounts or
passwords; they only ask this library "who is this user, and what may they do **in my application**?".

```
identity/
  src/SharedIdentity.Core   entities, DbContext (+ MySQL migrations), IdentityService, ApplicationAccessService, TokenService
  src/SharedIdentity.Cli    central admin tool: migrate, create-user, grant, members
  tests/SharedIdentity.Tests
```

## Common database schema (`shared_identity`)

| Table | Purpose | Key columns |
|---|---|---|
| `Users` | The **only** place accounts/passwords live | `Id` GUID, `FullName`, `Email`, `NormalizedEmail` (**unique**), `PhoneNumber`, `PasswordHash` (ASP.NET Identity v3 format), `ProfileImageUrl`, `IsActive`, `EmailConfirmed`, `PhoneNumberConfirmed`, `AccessFailedCount`, `LockoutEndUtc`, `SecurityStamp`, `CreatedAtUtc`, `UpdatedAtUtc`, `LastLoginAtUtc` |
| `Applications` | A consuming app | `Key` (unique, e.g. `netrokona`), `Name`, `IsActive` |
| `UserApplications` | Which user may enter which app | PK (`UserId`,`ApplicationId`) so no duplicates; `IsActive`, `GrantedByUserId`, `GrantedAtUtc` |
| `Roles` | **Per application** | `ApplicationId`, `Name`; unique (`ApplicationId`,`Name`) |
| `UserRoles` | User -> role | PK (`UserId`,`RoleId`), `AssignedByUserId` |
| `Permissions` | **Per application** | `ApplicationId`, `Key`; unique (`ApplicationId`,`Key`) |
| `RolePermissions` | Role -> permission | PK (`RoleId`,`PermissionId`) |

Because a role/permission row belongs to exactly one application, **SuperAdmin of Netrokona is a different row
from SuperAdmin of another app** and grants nothing there. `PasswordHash` uses the same format as ASP.NET Core
Identity's `PasswordHasher`, so another ASP.NET app can read the same table.

Guarantees enforced in code (and covered by tests): one global account per email; assigning an existing user is
idempotent and never creates accounts; roles can only be given to members and only from that app; the last
SuperAdmin of an app cannot be removed/demoted; removing a user from one app keeps the account and other apps;
lockout after 5 bad passwords; identical failure for unknown email vs wrong password (timing equalised).

## Application databases

Each application keeps its **own** business data in its **own** database and stores only the user's GUID
(`CreatedBy`, `UpdatedBy`, `ReviewedBy`, ...). There is deliberately **no cross-database foreign key** (works across
servers and keeps apps independently deployable); existence is validated in code and display names are resolved
from this database when needed (see Netrokona's audit screen).

## Authentication flow

1. App receives email + password and calls `IdentityService.AuthenticateAsync(appKey, email, password, access)`.
2. Checks: account exists, not locked, password valid, `IsActive`, email confirmed, **member of `appKey`** (active).
3. App creates its own session (Netrokona: HttpOnly SameSite=Strict cookie holding only the user id + security stamp).
4. On every request the app calls `ApplicationAccessService.GetAccessAsync(appKey, userId)` (short cache) to load that
   app's roles/permissions. Revoking a membership/role, deactivating the user, or changing the password
   (`SecurityStamp`) takes effect within seconds, everywhere.

### Future central login / SSO
`TokenService` issues short-lived JWTs whose **audience is the application key** and which carry only identity
(`sub`, `name`, `email`, `stamp`). Netrokona already validates them (`Auth:Sso:Enabled=true`, shared
`Auth:Sso:SigningKey`/`Issuer`): a token minted for another app is rejected, and even a valid token only works if the
user is a member of Netrokona. Roles/permissions are *always* resolved from the tables above, never trusted from
the token. To go further, put `TokenService` behind a small login service (or swap in OpenIddict/Duende and
validate with `AddJwtBearer(Authority=...)`); applications need no change beyond configuration. Move the symmetric
key to an asymmetric key (RS256) before exposing the issuer to more than one operator.

## Operating it

```bash
export SHARED_IDENTITY_CONNECTION="Server=...;Database=shared_identity;User=...;Password=..."
# MySQL by default; SHARED_IDENTITY_PROVIDER=Sqlite for local experiments
dotnet run --project identity/src/SharedIdentity.Cli -- migrate
IDENTITY_NEW_PASSWORD='...' dotnet run --project identity/src/SharedIdentity.Cli -- create-user --name "Full Name" --email you@example.com --confirmed
# (start the Netrokona API once so it registers its application/roles/permissions, or set Bootstrap:SuperAdminEmail)
dotnet run --project identity/src/SharedIdentity.Cli -- grant --app netrokona --email you@example.com --role SuperAdmin
dotnet run --project identity/src/SharedIdentity.Cli -- members --app netrokona
```

Creating global accounts is a central-identity job (this CLI today, a registration/login service later). Netrokona
never creates users; its SuperAdmin can only **assign existing** users and manage their Netrokona roles.

Schema changes of this database are owned **here** (`dotnet ef migrations add ... --project src/SharedIdentity.Core`),
not by any consuming app. Passwords are never passed on a command line (env var or hidden prompt).

## Tests

`dotnet test identity` -> 11 tests (SQLite in memory): duplicate prevention, hash compatibility, idempotent assignment,
application isolation, membership required for roles, removal scope, last-SuperAdmin guard, lockout, inactive users,
role-permission editing, registrar idempotence.

# Netrokona CMS API (ASP.NET Core 8 + EF Core + MySQL)

Hybrid CMS for the React site: admins manage content; the public contributes information, corrections and
photos; **nothing a visitor sends is ever published without an administrator's approval.**

Identity is **not** stored here. Accounts, passwords, roles and permissions live in the shared identity database
(see [`../identity/README.md`](../identity/README.md)). This API's own database (`netrokona_cms`) has **no user or
password table**; it stores only the shared user's GUID in `CreatedBy` / `UpdatedBy` / `ReviewedBy` / `UserId`.

## Application database (`netrokona_cms`)

| Table | Contents |
|---|---|
| `Content` | One table for Place, Institution, HealthFacility, GovernmentOffice, EmergencyService, News, Event, Info. Bilingual fields, upazila, coordinates, `PublishState` (Draft/Published/Archived), `IsActive`, `Version` (optimistic concurrency), `CreatedBy`/`UpdatedBy` (shared user ids) |
| `Media` | Image metadata (stored name, sha256, size, alt, credit, status Pending/Approved/Rejected, cover flag) - files live on disk outside the web root |
| `Submissions` | Public submissions (new content or correction), tracking code, hashed edit token, JSON payload, status, duplicate score/match, `ReviewedBy`, `Version` |
| `ReviewEvents` | Full review history: from/to status, reviewer id, internal remark, public note, time |
| `AuditLogs` | Who did what: user id, action, entity, details (diffs for corrections), hashed IP |

## Moderation workflow

`Pending -> UnderReview -> Approved | Rejected | NeedsCorrection`; `NeedsCorrection -> Pending` (contributor resubmits with the secret edit token) or `Rejected`; `Rejected -> UnderReview`; `Approved` is final.
- Rejecting or asking for corrections requires a note shown to the contributor on the tracking page.
- Approving a *new* submission creates a **Draft** unless the reviewer (who also needs `content.publish`) ticks "publish". Approving a *correction* applies only the supplied fields to the live item and records the before/after diff.
- Concurrent edits are rejected (HTTP 409) via version checks on submissions and content.
- Duplicate detection (bigram similarity on normalised English/Bengali titles, plus <100 m coordinate proximity) flags likely duplicates of existing content and of other open submissions for the reviewer; identical re-sends from the same client within 24 h are blocked.

## API surface

Public (`/api/public/*`, `/media/{id}`) - only **Published and active** content; images only when **Approved** and the content is public; submitter contact details are never returned.
`GET meta` · `GET content?type&upazila&q&page` · `GET content/{slug}` · `POST submissions` (multipart: `payload` JSON + up to 5 `images`) · `GET submissions/{code}` · `PUT submissions/{code}` (resubmit with `editToken`).

Admin (`/api/admin/*`, `/api/auth/*`) - authenticated shared-identity users who are **members of this application**, then per-action permissions:
`content.view|create|edit|delete|publish`, `submissions.view|review|approve`, `media.manage`, `audit.view`, `members.manage`, `roles.manage`.
System roles (editable by SuperAdmin): **SuperAdmin** (all), **Admin**, **Editor**, **Moderator**.
SuperAdmin tools (`/api/admin/members`): exact-email lookup of an *existing* global user, assign to Netrokona (idempotent), set Netrokona roles, remove from Netrokona, edit role permissions. These calls are hard-scoped to the `netrokona` application key.

## Security

- Auth: HttpOnly, SameSite=Strict, Secure (production) cookie holding only user id + security stamp; roles/permissions reloaded from the shared DB (20 s cache) so revocation is near-immediate; optional JWT bearer for future SSO (audience-bound).
- CSRF: cookie-authenticated mutations require `X-Requested-With: NetrokonaWeb` (a cross-site page cannot send it; CORS is off).
- Rate limits per client IP (configurable): login 5/min, submissions 10/h, tracking 20/min, public reads 240/min. Account lockout after 5 failures (in the shared DB). Login failures are indistinguishable.
- Uploads: extension allow-list, 5 MB, magic-byte check, pixel-count cap, minimum size; **every image is decoded and re-encoded** (drops EXIF/GPS and any appended payload), stored under a random name outside `wwwroot`, served only through the API as `image/jpeg` with `nosniff` and a sandbox CSP; rejected submissions' files are deleted.
- Input: lengths, enums, URL schemes (http/https only), coordinate bounds, upazila allow-list, HTML/script markers rejected (all text is plain text and rendered as text).
- Audit: every create/update/publish/delete/review/membership/permission change and login success/failure; raw IPs are never stored (HMAC with `Security:IpHashKey`).
- Headers: `nosniff`, `X-Frame-Options: DENY`, `no-referrer`, API CSP, HSTS in production.

## Configuration (no secrets in the repo)

`ConnectionStrings:Netrokona`, `ConnectionStrings:SharedIdentity` (MySQL), `Database:Provider` (`MySql` default | `Sqlite`),
`Security:IpHashKey`, `Auth:Sso:*`, `Bootstrap:SuperAdminEmail`, `Proxy:Enabled` (set behind nginx/IIS), `Uploads:*`, `RateLimiting:*`.
Use environment variables / user-secrets, e.g. `ConnectionStrings__Netrokona`. `appsettings.Development.json` uses local SQLite files in `backend/.data/` (git-ignored) so you can develop without MySQL.

## Run it

```bash
# 1. shared identity DB + first SuperAdmin (see identity/README.md)
# 2. this app's schema (MySQL):   dotnet ef database update --project backend/src/NetrokonaCms.Api --context NetrokonaDbContext
#    (or set Database:MigrateOnStartup=true)
# 3. API
cd backend/src/NetrokonaCms.Api && ASPNETCORE_URLS=http://localhost:5080 dotnet run
# 4. frontend (proxies /api and /media to the API; API_PROXY overrides the target)
npm run dev
```
Production: serve the built React app and the API from the **same origin** (reverse proxy `/api` and `/media`) so the strict cookie works; Vercel-only static hosting cannot host this API.
Pages: `/login`, `/admin` (dashboard, content, submissions, members & roles, audit, `/admin/legacy` = the previous browser-only tools, now behind login), `/contribute`, `/track[/CODE]`.

## Tests

`dotnet test backend` -> 21 integration tests over real HTTP (WebApplicationFactory, temporary SQLite for both databases): auth/authorization/CSRF, lockout and non-enumeration, cross-application isolation, immediate revocation, JWT audience binding, rate limits, submission -> pending -> approve -> publish, image privacy before publication, needs-correction/resubmit, rejection rules, stale versions, duplicates, corrections with audit diff, upload attacks, markup rejection, content CRUD/permissions/concurrency, member management without account creation/duplication, and "no user tables in the Netrokona DB".

## Known limitations

- **MySQL was not exercised here** (no MySQL server in the build environment). The MySQL provider (Pomelo 8.0.2) and both migrations (`NetrokonaCms.Api/Data/Migrations`, `SharedIdentity.Core/Migrations`) are generated and compile, but all tests ran on SQLite. Run `dotnet ef database update` against a real MySQL 8 and re-run the suite with `Database:Provider=MySql` before go-live.
- Email delivery (notifying contributors, account confirmation) is not implemented; contributors use the tracking page.
- Public text search uses simple `LIKE`; use MySQL FULLTEXT if content grows large.
- Rate-limit counters and the access cache are in-process; use a distributed store if you run several instances.
- Uploaded files are on local disk; mount shared storage or add an object-storage implementation for multiple instances.

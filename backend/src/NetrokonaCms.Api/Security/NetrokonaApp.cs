using SharedIdentity.Core;

namespace NetrokonaCms.Api.Security;

/// <summary>This application's identity in the shared identity database: its key, permissions and system roles.
/// They exist only under the "netrokona" application, so holding SuperAdmin here grants nothing elsewhere.</summary>
public static class NetrokonaApp
{
    public const string Key = "netrokona";

    public static class P
    {
        public const string ContentView = "content.view";
        public const string ContentCreate = "content.create";
        public const string ContentEdit = "content.edit";
        public const string ContentDelete = "content.delete";
        public const string ContentPublish = "content.publish";
        public const string SubmissionsView = "submissions.view";
        public const string SubmissionsReview = "submissions.review";
        public const string SubmissionsApprove = "submissions.approve";
        public const string MediaManage = "media.manage";
        public const string AuditView = "audit.view";
        public const string MembersManage = "members.manage";
        public const string RolesManage = "roles.manage";
    }

    public static readonly ApplicationDefinition Definition = new(Key, "Netrokona District Website",
        new[]
        {
            (P.ContentView, "See all content including drafts"),
            (P.ContentCreate, "Create content"),
            (P.ContentEdit, "Edit content"),
            (P.ContentDelete, "Delete content"),
            (P.ContentPublish, "Publish, unpublish and archive content"),
            (P.SubmissionsView, "See public submissions"),
            (P.SubmissionsReview, "Move submissions through review (under review, needs correction)"),
            (P.SubmissionsApprove, "Approve or reject submissions"),
            (P.MediaManage, "Upload and manage media"),
            (P.AuditView, "View the audit log"),
            (P.MembersManage, "Assign shared users to this application and manage their roles"),
            (P.RolesManage, "Edit the permissions of this application's roles"),
        },
        new[]
        {
            new RoleDefinition("SuperAdmin", "Full control of the Netrokona application", new[]
            {
                P.ContentView, P.ContentCreate, P.ContentEdit, P.ContentDelete, P.ContentPublish, P.SubmissionsView,
                P.SubmissionsReview, P.SubmissionsApprove, P.MediaManage, P.AuditView, P.MembersManage, P.RolesManage,
            }),
            new RoleDefinition("Admin", "Manage content and moderation", new[]
            {
                P.ContentView, P.ContentCreate, P.ContentEdit, P.ContentDelete, P.ContentPublish, P.SubmissionsView,
                P.SubmissionsReview, P.SubmissionsApprove, P.MediaManage, P.AuditView,
            }),
            new RoleDefinition("Editor", "Write and edit content", new[]
            {
                P.ContentView, P.ContentCreate, P.ContentEdit, P.MediaManage, P.SubmissionsView,
            }),
            new RoleDefinition("Moderator", "Review public submissions", new[]
            {
                P.ContentView, P.SubmissionsView, P.SubmissionsReview, P.SubmissionsApprove,
            }),
        });
}

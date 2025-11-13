using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    [Table("app_users", Schema = "public")]
    public class AppUser
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }  // This will match auth.users.id

        [Column("display_name")]
        public string DisplayName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("avatar_url")]
        public string AvatarUrl { get; set; }

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [Column("score")]
        public int Score { get; set; }

        // 🔗 Relationship to Supabase Auth user
        public SupabaseUser AuthUser { get; set; }

        [ForeignKey(nameof(Subject))]
        public virtual ICollection<Subject> Subjects {  get; set; } = new List<Subject>();

        // Sent friend requests
        public ICollection<AppUserFriend> FriendsInitiated { get; set; } = new List<AppUserFriend>();

        // Received friend requests
        public ICollection<AppUserFriend> FriendsReceived { get; set; } = new List<AppUserFriend>();
    }

}

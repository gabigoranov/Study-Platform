using StudyPlatform.Data.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    [Table("app_users", Schema = "public")]
    public abstract class AppUser
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }  // This will match auth.users.id

        [Column("display_name")]
        public string DisplayName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        [Column("discriminator")]
        public AppUserType Discriminator { get; set; } 

        [Column("organization_group_id")]
        [ForeignKey(nameof(OrganizationGroup))]
        public int? OrganizationGroupId { get; set; } // Can be null if the user is not part of any organization group

        public virtual OrganizationGroup OrganizationGroup { get; set; }

        // 🔗 Relationship to Supabase Auth user
        public SupabaseUser AuthUser { get; set; }

        [ForeignKey(nameof(Subject))]
        public virtual ICollection<Subject> Subjects {  get; set; } = new List<Subject>();
    }

}

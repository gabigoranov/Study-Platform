using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// PostgreSQL supabase auth.users table representation.
    /// </summary>
    [Table("users", Schema = "auth")]
    public class SupabaseUser
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("display_name")]
        public string DisplayName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("last_sign_in_at")]
        public DateTime? LastSignInAt { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

    }

}

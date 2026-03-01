using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models.DTOs
{
    public class StudentDTO
    {
        [Key]
        public Guid Id { get; set; }  // This will match auth.users.id

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public int Score { get; set; }
    }
}

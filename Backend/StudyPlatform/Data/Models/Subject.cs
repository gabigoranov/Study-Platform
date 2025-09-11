using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// A subject that groups material groups together.
    /// </summary>
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Title { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public DateTimeOffset DateCreated { get; set; } = DateTimeOffset.UtcNow;

        public virtual ICollection<MaterialSubGroup> MaterialSubGroups { get; set; } = new List<MaterialSubGroup>();
    }
}

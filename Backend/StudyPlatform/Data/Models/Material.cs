using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// A general material entity that can be extended for specific types of study materials.
    /// </summary>
    public abstract class Material
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public DateTimeOffset DateCreated { get; set; } = DateTimeOffset.UtcNow;

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public int MaterialSubGroupId { get; set; }

        [Required]
        public Difficulty Difficulty { get; set; } = Difficulty.Medium;

        public virtual MaterialSubGroup MaterialSubGroup { get; set; }
    }
}

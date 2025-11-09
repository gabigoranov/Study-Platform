using StudyPlatform.Data.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// A subgroup within a MaterialGroup that contains specific materials.
    /// </summary>
    public class MaterialSubGroup
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Title { get; set; }

        [Required]
        public MaterialGroupType MaterialGroupType { get; set; }

        [Required]
        [ForeignKey(nameof(Models.Subject))]
        public Guid SubjectId { get; set; }

        public virtual Subject Subject { get; set; }

        public DateTimeOffset DateCreated { get; set; } = DateTimeOffset.UtcNow;

        public virtual ICollection<Material> Materials { get; set; } = new List<Material>();
    }
}

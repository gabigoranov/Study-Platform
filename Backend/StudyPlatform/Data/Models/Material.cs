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
        [MaxLength(20)]
        public string Title { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public int MaterialSubGroupId { get; set; }

        public virtual MaterialSubGroup MaterialSubGroup { get; set; }
    }
}

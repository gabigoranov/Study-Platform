using StudyPlatform.Data.Types;
using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    /// <summary>
    /// View model used when creating a new material subgroup.
    /// </summary>
    public class CreateMaterialSubGroupViewModel
    {
        /// <summary>
        /// The title of the subgroup.
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The type of material group this subgroup belongs to.
        /// </summary>
        [Required]
        public MaterialGroupType MaterialGroupType { get; set; }

        /// <summary>
        /// The ID of the subject this subgroup belongs to.
        /// </summary>
        [Required]
        public Guid SubjectId { get; set; }
    }
}

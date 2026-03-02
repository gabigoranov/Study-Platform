using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    /// <summary>
    /// View model used when updating an organization group.
    /// </summary>
    public class UpdateOrganizationGroupViewModel
    {
        /// <summary>
        /// The title of the organization group.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The ID of the organization this group belongs to.
        /// </summary>
        [Required]
        public int OrganizationId { get; set; }
    }
}

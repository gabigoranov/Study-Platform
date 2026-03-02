using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    /// <summary>
    /// View model used when creating a new organization.
    /// </summary>
    public class CreateOrganizationViewModel
    {
        /// <summary>
        /// The title of the organization.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The town where the organization is located.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Town { get; set; } = string.Empty;

        /// <summary>
        /// The country where the organization is located.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Country { get; set; } = string.Empty;

        /// <summary>
        /// The address of the organization.
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string Address { get; set; } = string.Empty;
    }
}

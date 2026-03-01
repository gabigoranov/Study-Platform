using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// Represents an organization entity with identifying and location information.
    /// </summary>
    public class Organization
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }

        [Required]
        [StringLength(50)]
        public string Town { get; set; }

        [Required]
        [StringLength(50)]
        public string Country { get; set; }

        [Required]
        [StringLength(50)]
        public string Address { get; set; }

        public virtual ICollection<OrganizationGroup> OrganizationGroups { get; set; } = new List<OrganizationGroup>();

    }
}

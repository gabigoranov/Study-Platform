using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// A subclass for the Organization model, representing groups within an organization.
    /// A group will have a many-to-one relationship with the AppUser model.
    /// </summary>
    public class OrganizationGroup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [ForeignKey(nameof(Models.Organization))]
        public int OrganizationId { get; set; }

        public Organization Organization { get; set; }

        public virtual ICollection<AppUser> AppUsers { get; set; } = new List<AppUser>();
    }
}

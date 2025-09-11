using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    /// <summary>
    /// View model used when creating a new subject.
    /// </summary>
    public class CreateSubjectViewModel
    {
        /// <summary>
        /// The title of the subject.
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Title { get; set; } = string.Empty;

    }
}

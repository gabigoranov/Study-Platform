using StudyPlatform.Data.Models;
using StudyPlatform.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models
{
    public class CreateFlashcardViewModel
    {
        [Required]
        public string Front { get; set; }

        [Required]
        public string Back { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public Guid MaterialSubGroupId { get; set; }

        [Required]
        public Difficulty Difficulty { get; set; } = Difficulty.Medium;
    }
}

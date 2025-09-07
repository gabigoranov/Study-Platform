using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class FlashcardViewModel
    {
        [Required]
        public string Front { get; set; }

        [Required]
        public string Back { get; set; }

    }
}

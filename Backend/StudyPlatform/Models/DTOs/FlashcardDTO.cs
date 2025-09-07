using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models.DTOs
{
    public class FlashcardDTO
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Front { get; set; }

        [Required]
        public string Back { get; set; }

    }
}

using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models.DTOs
{
    public class FlashcardDTO : MaterialDTO
    {
        [Required]
        public string Front { get; set; }

        [Required]
        public string Back { get; set; }
    }
}

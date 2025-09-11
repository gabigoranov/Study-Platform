using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Data.Models
{
    public class Flashcard : Material
    {
        [Required]
        public string Front { get; set; }

        [Required]
        public string Back {  get; set; }
    }
}

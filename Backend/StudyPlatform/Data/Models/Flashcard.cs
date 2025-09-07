using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Data.Models
{
    public class Flashcard
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Front { get; set; }

        [Required]
        public string Back {  get; set; }

        [Required]
        public Guid UserId { get; set; }
    }
}

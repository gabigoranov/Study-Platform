using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Data.Models
{
    public class Quiz : Material
    {
        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    }
}

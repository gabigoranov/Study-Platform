using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    public class QuizQuestionAnswer
    {

        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(QuizQuestion))]
        public Guid QuizQuestionId { get; set; }

        public virtual QuizQuestion QuizQuestion { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}

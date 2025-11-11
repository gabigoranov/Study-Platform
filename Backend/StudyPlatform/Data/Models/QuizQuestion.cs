using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    public class QuizQuestion
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(Quiz))]
        public Guid QuizId { get; set; }

        public virtual Quiz Quiz { get; set; }

        [Required]
        [ForeignKey(nameof(QuizQuestionAnswer))]
        public Guid CorrectQuizQuestionAnswerId { get; set; }

        public virtual QuizQuestionAnswer CorrectQuizQuestionAnswer { get; set; }

        public ICollection<QuizQuestionAnswer> Answers { get; set; } = new List<QuizQuestionAnswer>();
    }
}

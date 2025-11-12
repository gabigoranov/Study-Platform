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

        [NotMapped]
        public Guid CorrectQuizQuestionAnswerId => Answers.Single(x => x.IsCorrect).Id;

        [NotMapped]
        public virtual QuizQuestionAnswer CorrectQuizQuestionAnswer => Answers.Single(x => x.IsCorrect);

        public ICollection<QuizQuestionAnswer> Answers { get; set; } = new List<QuizQuestionAnswer>();
    }
}

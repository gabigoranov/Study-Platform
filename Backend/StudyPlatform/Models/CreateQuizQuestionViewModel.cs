using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models
{
    public class CreateQuizQuestionViewModel
    {
        [Required]
        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(Quiz))]
        public Guid QuizId { get; set; }

        public IEnumerable<CreateQuizQuestionAnswerViewModel> Answers { get; set; } = new List<CreateQuizQuestionAnswerViewModel>();
    }
}
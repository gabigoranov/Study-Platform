using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class CreateQuizQuestionViewModel
    {
        [Required]
        public string Description { get; set; }

        [Required]
        public Guid CorrectQuizQuestionAnswerId { get; set; }

        public IEnumerable<CreateQuizQuestionAnswerViewModel> Answers { get; set; } = new List<CreateQuizQuestionAnswerViewModel>();
    }
}
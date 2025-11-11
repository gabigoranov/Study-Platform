using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class CreateQuizQuestionAnswerViewModel
    {
        [Required]
        public string Description { get; set; }
    }
}
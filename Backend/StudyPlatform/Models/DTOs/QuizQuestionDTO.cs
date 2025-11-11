using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models.DTOs
{
    public class QuizQuestionDTO
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid QuizId { get; set; }

        [Required]
        public Guid CorrectQuizQuestionAnswerId { get; set; }

        public virtual QuizQuestionAnswerDTO CorrectQuizQuestionAnswer { get; set; }

        public IEnumerable<QuizQuestionAnswerDTO> Answers { get; set; } = new List<QuizQuestionAnswerDTO>();
    }
}
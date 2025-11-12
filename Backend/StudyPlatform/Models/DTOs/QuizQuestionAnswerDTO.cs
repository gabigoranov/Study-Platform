using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models.DTOs
{
    public class QuizQuestionAnswerDTO
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Guid QuizQuestionId { get; set; }
        [Required]
        public bool IsCorrect { get; set; }
    }
}
using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models.DTOs
{
    public class QuizDTO : MaterialDTO
    {
        [Required]
        public string Description { get; set; }

        public IEnumerable<QuizQuestionDTO> Questions { get; set; } = new List<QuizQuestionDTO>();
    }
}
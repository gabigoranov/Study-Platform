using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class GeneratedQuizDTO
    {
        [Required]
        [StringLength(50)]
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [Required]
        [StringLength(400)]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [Required]
        [JsonPropertyName("difficulty")]
        public Difficulty Difficulty { get; set; }

        [JsonPropertyName("questions")]
        public ICollection<GeneratedQuizQuestionDTO> Questions { get; set; } = new List<GeneratedQuizQuestionDTO>();
    }
}

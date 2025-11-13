using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class GeneratedQuizQuestionDTO
    {
        [Required]
        [StringLength(400)]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("answers")]
        public ICollection<GeneratedQuizQuestionAnswerDTO> Answers { get; set; } = new List<GeneratedQuizQuestionAnswerDTO>();
    }
}

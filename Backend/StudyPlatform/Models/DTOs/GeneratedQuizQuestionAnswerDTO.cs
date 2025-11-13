using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class GeneratedQuizQuestionAnswerDTO
    {

        [Required]
        [StringLength(400)]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [Required]
        [JsonPropertyName("isCorrect")]
        public bool IsCorrect { get; set; }
    }
}

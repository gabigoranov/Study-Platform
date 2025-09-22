using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class GeneratedFlashcardDTO
    {
        [JsonPropertyName("title")]
        [Required]
        public string Title { get; set; }

        [JsonPropertyName("front")]
        [Required]
        public string Front { get; set; }

        [JsonPropertyName("back")]
        [Required]
        public string Back { get; set; }

        [JsonPropertyName("difficulty")]
        [Required]
        public Difficulty Difficulty { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class MindmapEdgeDTO
    {
        [JsonPropertyName("id")]
        [Required]
        public string Id { get; set; }

        [JsonPropertyName("source")]
        [Required]
        public string Source { get; set; }

        [JsonPropertyName("target")]
        [Required]
        public string Target { get; set; }

        [JsonPropertyName("label")]
        [Required]
        public string Label { get; set; }
    }
}

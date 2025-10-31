using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class GeneratedMindmapDTO
    {
        [JsonPropertyName("nodes")]
        [Required]
        public List<MindmapNodeDTO> Nodes { get; set; }

        [JsonPropertyName("edges")]
        [Required]
        public List<MindmapEdgeDTO> Edges { get; set; }

        [JsonPropertyName("title")]
        [Required]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        [Required]
        public string Description { get; set; }

        [JsonPropertyName("difficulty")]
        [Required]
        public Difficulty Difficulty { get; set; }
    }
}

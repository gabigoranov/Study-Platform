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
    }
}

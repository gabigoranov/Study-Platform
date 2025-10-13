using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class MindmapNodeDTO
    {
        [JsonPropertyName("id")]
        [Required]
        public string Id { get; set; }

        [JsonPropertyName("data")]
        [Required]
        public NodeDataDTO Data { get; set; }

        [JsonPropertyName("position")]
        [Required]
        public NodePositionDTO Position { get; set; }
    }
}

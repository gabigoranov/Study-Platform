using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class NodeDataDTO
    {
        [JsonPropertyName("label")]
        [Required]
        public string Label { get; set; }
    }
}

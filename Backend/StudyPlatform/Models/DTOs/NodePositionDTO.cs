using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    public class NodePositionDTO
    {
        [JsonPropertyName("x")]
        [Required]
        public double X { get; set; }

        [JsonPropertyName("y")]
        [Required]
        public double Y { get; set; }
    }
}

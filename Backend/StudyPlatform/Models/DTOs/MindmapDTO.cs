using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using StudyPlatform.Data.Models;

namespace StudyPlatform.Models.DTOs
{
    public class MindmapDTO : MaterialDTO
    {
        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        // JSONB column mapping
        [Column(TypeName = "jsonb")]
        public JsonDocument Data { get; set; }
    }
}

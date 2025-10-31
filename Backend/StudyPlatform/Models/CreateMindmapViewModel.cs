using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using StudyPlatform.Data.Models;

namespace StudyPlatform.Models
{
    public class CreateMindmapViewModel
    {
        [Required]
        [StringLength(30)]
        public string Title { get; set; }

        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int MaterialSubGroupId { get; set; }

        // JSONB column mapping
        [Column(TypeName = "jsonb")]
        public JsonDocument Data { get; set; }

        public Difficulty Difficulty { get; set; } = Difficulty.Easy;
    }
}

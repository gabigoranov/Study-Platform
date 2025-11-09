using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    [JsonDerivedType(typeof(FlashcardDTO), "Flashcard")]
    [JsonDerivedType(typeof(MindmapDTO), "Mindmap")]
    public class MaterialDTO
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public Guid MaterialSubGroupId { get; set; }

        [Required]
        public Guid SubjectId { get; set; }

        [Required]
        public Difficulty Difficulty { get; set; } = Difficulty.Medium;
        public DateTimeOffset DateCreated { get; set; } = DateTimeOffset.UtcNow;
    }
}

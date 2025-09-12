using StudyPlatform.Data.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyPlatform.Models.DTOs
{
    [JsonDerivedType(typeof(FlashcardDTO), "Flashcard")]
    public class MaterialDTO
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public int MaterialSubGroupId { get; set; }
    }
}

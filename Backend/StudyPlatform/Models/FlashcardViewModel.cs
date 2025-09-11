using StudyPlatform.Data.Models;
using StudyPlatform.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models
{
    public class FlashcardViewModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Front { get; set; }

        [Required]
        public string Back { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public int MaterialSubGroupId { get; set; }
    }
}

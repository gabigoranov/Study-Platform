using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class GenerateFlashcardsViewModel
    {
        [Required]
        public string FileDownloadUrl { get; set; }
    }
}

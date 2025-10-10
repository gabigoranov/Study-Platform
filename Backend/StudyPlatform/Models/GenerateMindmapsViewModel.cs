using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class GenerateMindmapsViewModel
    {
        [Required]
        public string FileDownloadUrl { get; set; }

        [StringLength(200)]
        public string CustomPrompt { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Models
{
    public class UpdateScoreViewModel
    {
        [Required]
        public int ModifyScoreBy { get; set; }
    }
}

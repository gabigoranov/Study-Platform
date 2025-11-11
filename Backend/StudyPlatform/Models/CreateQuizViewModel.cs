using StudyPlatform.Data.Models;
using StudyPlatform.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Models
{
    public class CreateQuizViewModel
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [ForeignKey(nameof(MaterialSubGroup))]
        public Guid MaterialSubGroupId { get; set; }

        [Required]
        public Difficulty Difficulty { get; set; } = Difficulty.Medium;

        public IEnumerable<CreateQuizQuestionViewModel> Questions { get; set; } = new List<CreateQuizQuestionViewModel>();
    }
}
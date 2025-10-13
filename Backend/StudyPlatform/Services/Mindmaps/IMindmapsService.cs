using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Mindmaps
{
    /// <summary>
    /// An interface defining operations related to mindmaps.
    /// </summary>
    public interface IMindmapsService
    {
        /// <summary>
        /// Generates a set of mindmaps from the provided model.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<GeneratedMindmapDTO> GenerateAsync(GenerateMindmapsViewModel model, Guid userId);
    }
}

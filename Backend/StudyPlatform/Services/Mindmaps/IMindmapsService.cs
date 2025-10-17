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
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<MindmapDTO> CreateAsync(CreateMindmapViewModel model, Guid userId);

        /// <summary>
        /// Generates a set of mindmaps from the provided model.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="subGroupId"></param>
        /// <param name="subjectId"></param>
        /// <returns></returns>
        public Task<IEnumerable<MindmapDTO>> GetAllAsync(Guid userId, int? subGroupId, int? subjectId);

        /// <summary>
        /// Generates a set of mindmaps from the provided model.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<GeneratedMindmapDTO> GenerateAsync(GenerateMindmapsViewModel model, Guid userId);
    }
}

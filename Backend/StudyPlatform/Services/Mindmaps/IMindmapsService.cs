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
        public Task<IEnumerable<MindmapDTO>> GetAllAsync(Guid userId, Guid? subGroupId, Guid? subjectId);

        /// <summary>
        /// Generates a set of mindmaps from the provided model.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<GeneratedMindmapDTO> GenerateAsync(GenerateMindmapsViewModel model, Guid userId);

        /// <summary>
        /// Deletes mindmaps by their IDs for the specified user.
        /// </summary>
        /// <param name="ids">An array of mindmaps IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the mindmaps.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous delete operation.</returns>
        Task DeleteAsync(Guid[] ids, Guid userId);

        /// <summary>
        /// Update a mindmap for the specified user.
        /// </summary>
        /// <param name="id">The mindmap id.</param>
        /// <param name="userId">The ID of the user who owns the mindmaps.</param>
        /// <param name="model">The model by which to update the mindmap.</param>
        /// <returns>An updated MindmapDTO.</returns>
        Task<MindmapDTO> UpdateAsync(CreateMindmapViewModel model, Guid userId, Guid id);
    }
}

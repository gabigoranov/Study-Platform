using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.MaterialSubGroups
{
    /// <summary>
    /// Defines methods for managing material subgroups.
    /// </summary>
    public interface IMaterialSubGroupsService
    {
        /// <summary>
        /// Retrieves all material subgroups for a given subject.
        /// </summary>
        /// <param name="subjectId">The subject ID.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <param name="includeMaterials">Whether or not to include the materials in each group.</param>
        /// <returns>A collection of subgroups.</returns>
        Task<IEnumerable<MaterialSubGroupDTO>> GetAsync(Guid subjectId, Guid userId, bool includeMaterials = false);

        /// <summary>
        /// Retrieves a material subgroup by its ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>The subgroup if found, otherwise null.</returns>
        Task<MaterialSubGroupDTO?> GetByIdAsync(Guid id, Guid userId);

        /// <summary>
        /// Creates a new material subgroup.
        /// </summary>
        /// <param name="model">The subgroup creation model.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>The created subgroup DTO.</returns>
        Task<MaterialSubGroupDTO> CreateAsync(CreateMaterialSubGroupViewModel model, Guid userId);

        /// <summary>
        /// Deletes materials subgroups by ID in bulk.
        /// </summary>
        /// <param name="ids">The subgroup IDs.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>True if deleted, false otherwise.</returns>
        Task<bool> DeleteAsync(Guid[] ids, Guid userId);

        /// <summary>
        /// Edits an existing sub group for the specified user.
        /// </summary>
        /// <param name="model">The updated sub group data.</param>
        /// <param name="userId">The ID of the user who owns the sub group.</param>
        /// <param name="id">The ID of the sub group.</param>
        /// <returns>
        /// A <see cref="Task{MaterialSubGroupDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="MaterialSubGroupDTO"/>.
        /// </returns>
        Task<MaterialSubGroupDTO> UpdateAsync(CreateMaterialSubGroupViewModel model, Guid userId, Guid id);
    }
}

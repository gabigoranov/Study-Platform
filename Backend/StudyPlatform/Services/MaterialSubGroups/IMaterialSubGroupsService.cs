using StudyPlatform.Models.DTOs;
using StudyPlatform.Models;

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
        Task<IEnumerable<MaterialSubGroupDTO>> GetSubGroupsBySubjectAsync(int subjectId, Guid userId, bool includeMaterials = false);

        /// <summary>
        /// Retrieves a material subgroup by its ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>The subgroup if found, otherwise null.</returns>
        Task<MaterialSubGroupDTO?> GetSubGroupByIdAsync(int id, Guid userId);

        /// <summary>
        /// Creates a new material subgroup.
        /// </summary>
        /// <param name="model">The subgroup creation model.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>The created subgroup DTO.</returns>
        Task<MaterialSubGroupDTO> CreateSubGroupAsync(CreateMaterialSubGroupViewModel model, Guid userId);

        /// <summary>
        /// Deletes a material subgroup by ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <param name="userId">The ID of the authenticated user.</param>
        /// <returns>True if deleted, false otherwise.</returns>
        Task<bool> DeleteSubGroupAsync(int id, Guid userId);
    }
}

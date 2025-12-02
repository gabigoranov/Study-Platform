using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Subjects
{
    /// <summary>
    /// Defines methods for managing subjects.
    /// </summary>
    public interface ISubjectsService
    {
        /// <summary>
        /// Retrieves all subjects belonging to a given user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        /// <param name="includeGroups">Query parameter for whether or not to include MaterialSubGroups</param>
        /// <param name="includeGroupsSummary">Query parameter for whether or not to include MaterialSubGroups summary ( without materials )</param>
        /// <returns>A collection of subjects.</returns>
        Task<IEnumerable<SubjectDTO>> GetByUserAsync(Guid userId, bool includeGroups = false, bool includeGroupsSummary = false);

        /// <summary>
        /// Retrieves a single subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <param name="userId">The user ID.</param>
        /// <returns>The subject DTO if found, otherwise null.</returns>
        Task<SubjectDTO> GetByIdAsync(Guid id, Guid userId);

        /// <summary>
        /// Creates a new subject.
        /// </summary>
        /// <param name="model">The subject creation model.</param>
        /// <param name="userId">The user ID.</param>
        /// <returns>The created subject DTO.</returns>
        Task<SubjectDTO> CreateAsync(CreateSubjectViewModel model, Guid userId);

        /// <summary>
        /// Deletes a subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <param name="userId">The user ID.</param>
        Task DeleteAsync(Guid id, Guid userId);

        /// <summary>
        /// Edits an existing subject for the specified user.
        /// </summary>
        /// <param name="model">The updated subject data.</param>
        /// <param name="userId">The ID of the user who owns the subject.</param>
        /// <param name="id">The ID of the subject.</param>
        /// <returns>
        /// A <see cref="Task{SubjectDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="Subject"/>.
        /// </returns>
        Task<SubjectDTO> UpdateAsync(CreateSubjectViewModel model, Guid userId, Guid id);
    }
}

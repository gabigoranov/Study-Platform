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
        /// <returns>A collection of subjects.</returns>
        Task<IEnumerable<SubjectDto>> GetSubjectsByUserAsync(Guid userId);

        /// <summary>
        /// Retrieves a single subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <returns>The subject DTO if found, otherwise null.</returns>
        Task<SubjectDto?> GetSubjectByIdAsync(int id);

        /// <summary>
        /// Creates a new subject.
        /// </summary>
        /// <param name="model">The subject creation model.</param>
        /// <param name="userId">The user ID.</param>
        /// <returns>The created subject DTO.</returns>
        Task<SubjectDto> CreateSubjectAsync(CreateSubjectViewModel model, Guid userId);

        /// <summary>
        /// Deletes a subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <param name="userId">The user ID.</param>
        /// <returns>True if deleted, false otherwise.</returns>
        Task<bool> DeleteSubjectAsync(int id, Guid userId);
    }
}

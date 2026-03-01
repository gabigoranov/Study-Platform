using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Students
{
    /// <summary>
    /// Provides operations for managing student data, including updating student scores asynchronously.
    /// </summary>
    public interface IStudentsService
    {
        /// <summary>
        /// Asynchronously updates the score for the specified student and returns the updated student information.
        /// </summary>
        /// <param name="userId">The unique identifier of the student whose score will be updated.</param>
        /// <param name="modifyBy">The identifier of the user performing the update operation.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a StudentDTO with the updated
        /// student information.</returns>
        public Task<StudentDTO> UpdateScoreAsync(Guid userId, int modifyBy);
    }
}

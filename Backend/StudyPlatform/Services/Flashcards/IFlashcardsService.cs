using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Flashcards
{
    /// <summary>
    /// Provides operations for creating, editing, retrieving, and deleting flashcards.
    /// </summary>
    public interface IFlashcardsService
    {
        /// <summary>
        /// Creates a new flashcard for the specified user.
        /// </summary>
        /// <param name="model">The flashcard data to create.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <returns>
        /// A <see cref="Task{FlashcardDTO}"/> representing the asynchronous operation.
        /// The task result contains the created <see cref="FlashcardDTO"/>.
        /// </returns>
        Task<FlashcardDTO> CreateAsync(CreateFlashcardViewModel model, Guid userId);

        /// <summary>
        /// Edits an existing flashcard for the specified user.
        /// </summary>
        /// <param name="model">The updated flashcard data.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <returns>
        /// A <see cref="Task{FlashcardDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="Flashcard"/>.
        /// </returns>
        Task<FlashcardDTO> UpdateAsync(CreateFlashcardViewModel model, Guid userId, int id);

        /// <summary>
        /// Retrieves a flashcard by it's ID for the specified user.
        /// </summary>
        /// <param name="id">A flashcard ID to retrieve.</param>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <returns>
        /// A <see cref="Task{FlashcardDTO}"/> representing the asynchronous operation.
        /// The task result contains a of <see cref="FlashcardDTO"/> object.
        /// </returns>
        Task<FlashcardDTO> GetAsync(Guid userId, int id);

        /// <summary>
        /// Retrieves all flashcards for the specified user.
        /// </summary>
        /// <param name="userId">The specified userId.</param>
        /// <param name="groupId">Specifies the group from which to select flashcards. If left unspecified will return all flashcards..</param>
        /// <returns>A collection of flashcards if successful.</returns>
        Task<IEnumerable<FlashcardDTO>> GetAllAsync(Guid userId, int? groupId = null);

        /// <summary>
        /// Deletes flashcards by their IDs for the specified user.
        /// </summary>
        /// <param name="ids">An array of flashcard IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous delete operation.</returns>
        Task DeleteAsync(int[] ids, Guid userId);

        /// <summary>
        /// Request the generation of flashcards using AI based on the provided model from a microservice.
        /// </summary>
        /// <param name="userId">The user's ID</param>
        /// <param name="model">The model containing the download url and other prompt data.</param>
        /// <returns></returns>
        Task<string> GenerateAsync(Guid userId, GenerateFlashcardsViewModel model);
    }
}

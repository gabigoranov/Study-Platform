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
        /// The task result contains the created <see cref="Flashcard"/>.
        /// </returns>
        Task<FlashcardDTO> CreateAsync(FlashcardViewModel model, Guid userId);

        /// <summary>
        /// Edits an existing flashcard for the specified user.
        /// </summary>
        /// <param name="model">The updated flashcard data.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <returns>
        /// A <see cref="Task{FlashcardDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="Flashcard"/>.
        /// </returns>
        Task<FlashcardDTO> UpdateAsync(FlashcardViewModel model, Guid userId, int id);

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
        /// <returns>A collection of flashcards if successful.</returns>
        Task<IEnumerable<FlashcardDTO>> GetAllAsync(Guid userId);

        /// <summary>
        /// Deletes flashcards by their IDs for the specified user.
        /// </summary>
        /// <param name="ids">An array of flashcard IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous delete operation.</returns>
        Task DeleteAsync(int[] ids, Guid userId);
    }
}

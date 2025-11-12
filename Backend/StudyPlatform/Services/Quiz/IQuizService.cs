using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Quiz
{
    /// <summary>
    /// Provides operations for creating, editing, retrieving, and deleting quizzes.
    /// </summary>
    public interface IQuizService
    {
        /// <summary>
        /// Creates a new quiz for the specified user.
        /// </summary>
        /// <param name="model">The quiz data to create.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <returns>
        /// A <see cref="Task{QuizDTO}"/> representing the asynchronous operation.
        /// The task result contains the created <see cref="QuizDTO"/>.
        /// </returns>
        Task<QuizDTO> CreateAsync(CreateQuizViewModel model, Guid userId);

        /// <summary>
        /// Creates new quizzes for the specified user.
        /// </summary>
        /// <param name="model">The quizzes data to create.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <returns>
        /// A <see cref="Task{IEnumerable}"/> representing the asynchronous operation.
        /// The task result contains the created <see cref="QuizDTO"/>.
        /// </returns>
        Task<IEnumerable<QuizDTO>> CreateBulkAsync(IEnumerable<CreateQuizViewModel> model, Guid userId);

        /// <summary>
        /// Edits an existing quiz for the specified user.
        /// </summary>
        /// <param name="model">The updated quiz data.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <param name="id">The ID of the quiz.</param>
        /// <returns>
        /// A <see cref="Task{QuizDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="Quiz"/>.
        /// </returns>
        Task<QuizDTO> UpdateAsync(CreateQuizViewModel model, Guid userId, Guid id);

        /// <summary>
        /// Retrieves a quiz by it's ID for the specified user.
        /// </summary>
        /// <param name="id">A quiz ID to retrieve.</param>
        /// <param name="userId">The ID of the user who owns the quizzes.</param>
        /// <returns>
        /// A <see cref="Task{QuizDTO}"/> representing the asynchronous operation.
        /// The task result contains a of <see cref="QuizDTO"/> object.
        /// </returns>
        Task<QuizDTO> GetAsync(Guid userId, Guid id);

        /// <summary>
        /// Retrieves all quizzes for the specified user.
        /// </summary>
        /// <param name="userId">The specified userId.</param>
        /// <param name="subjectId">The optional subjectId parameter.</param>
        /// <param name="groupId">Specifies the group from which to select quizzes. If left unspecified will return all quizzes.</param>
        /// <returns>A collection of quizzes if successful.</returns>
        Task<IEnumerable<QuizDTO>> GetAllAsync(Guid userId, Guid? groupId = null, Guid? subjectId = null);

        /// <summary>
        /// Deletes quizzes by their IDs for the specified user.
        /// </summary>
        /// <param name="ids">An array of quiz IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the quizzes.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous delete operation.</returns>
        Task DeleteAsync(Guid[] ids, Guid userId);

        /// <summary>
        /// Adds questions and their answers to an existing quiz.
        /// </summary>
        /// <param name="questions">The questions and answers to add to the quiz.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <param name="quizId">The ID of the quiz to add questions to.</param>
        /// <returns>
        /// A <see cref="Task{QuizDTO}"/> representing the asynchronous operation.
        /// The task result contains the updated <see cref="QuizDTO"/>.
        /// </returns>
        Task<QuizDTO> AddQuestionsToQuizAsync(IEnumerable<CreateQuizQuestionViewModel> questions, Guid userId, Guid quizId);
    }
}
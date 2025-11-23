using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Data.Models;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Quiz;
using System.Collections.Generic;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages quizzes for the authenticated user.
    /// </summary>
    /// <remarks>
    /// All endpoints in this controller require authentication.
    /// The user ID is extracted from the JWT token.
    /// Validation errors are automatically handled by global middleware.
    /// Unhandled exceptions return a standardized error response.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="quizService">The quiz service, dependency injected.</param>
        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        /// <summary>
        /// Creates a quiz.
        /// </summary>
        /// <param name="model">The model for the quiz created by the user.</param>
        /// <returns>A new quiz if successful.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(QuizDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateQuizViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.CreateAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Creates multiple quizzes.
        /// </summary>
        /// <param name="model">The model for the quiz created by the user.</param>
        /// <returns>A new quiz if successful.</returns>
        [HttpPost("bulk")]
        [ProducesResponseType(typeof(IEnumerable<QuizDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateBulk([FromBody] IEnumerable<CreateQuizViewModel> model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            IEnumerable<QuizDTO> res = await _quizService.CreateBulkAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Gets a quiz by ID.
        /// </summary>
        /// <param name="id">The quiz id.</param>
        /// <returns>A quiz if successful.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(QuizDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            QuizDTO res = await _quizService.GetAsync(userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Gets all of user's quizzes.
        /// </summary>
        /// <returns>A list of quizzes if successful.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<QuizDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<QuizDTO> res = await _quizService.GetAllAsync(userId);
            return Ok(res);
        }

        /// <summary>
        /// Gets all of user's quizzes from a sub group.
        /// </summary>
        /// <returns>A list of quizzes if successful.</returns>
        [HttpGet("group/{id}")]
        [ProducesResponseType(typeof(IEnumerable<QuizDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] Guid id, [FromQuery] Guid? subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<QuizDTO> res = await _quizService.GetAllAsync(userId, id, subjectId);
            return Ok(res);
        }

        /// <summary>
        /// Updates quiz.
        /// </summary>
        /// <param name="model">The model for updating the quiz.</param>
        /// <param name="id">The id of the quiz.</param>
        /// <returns>An edited quiz if successful.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(QuizDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] CreateQuizViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Deletes multiple quizzes by IDs.
        /// </summary>
        /// <param name="ids">The array of quiz ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _quizService.DeleteAsync(ids, userId);
            return Ok();
        }

        /// <summary>
        /// Deletes a quiz by Id.
        /// </summary>
        /// <param name="id">The array of quiz ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteSingle([FromRoute] Guid id)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _quizService.DeleteAsync([id], userId);
            return Ok();
        }

        /// <summary>
        /// Deletes a quiz question by Id.
        /// </summary>
        /// <param name="id">The array of quiz ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("question/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteSingleQuestion([FromRoute] Guid id)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _quizService.DeleteQuestionAsync(id, userId);
            return Ok();
        }

        /// <summary>
        /// Adds questions and answers to a quiz.
        /// </summary>
        /// <param name="quizId">The ID of the quiz to add questions to.</param>
        /// <param name="questions">The questions and answers to add to the quiz.</param>
        /// <returns>The updated quiz with the new questions if successful.</returns>
        [HttpPost("{quizId}/questions")]
        [ProducesResponseType(typeof(QuizDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddQuestionsToQuiz([FromRoute] Guid quizId, [FromBody] IEnumerable<CreateQuizQuestionViewModel> questions)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.AddQuestionsToQuizAsync(questions, userId, quizId);
            return Ok(res);
        }

        /// <summary>
        /// Generates quizz from a file url via microservice.
        /// </summary>
        /// <param name="model">The model containing the file's download url and other prompt data.</param>
        /// <returns>A quiz if successful.</returns>
        [HttpPost("generate")]
        [ProducesResponseType(typeof(GeneratedQuizDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Generate([FromBody] GenerateQuizViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            GeneratedQuizDTO res = await _quizService.GenerateAsync(userId, model);

            return Ok(res);
        }
    }
}
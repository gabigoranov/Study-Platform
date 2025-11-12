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
    /// Provides endpoints for managing quizzes.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;

        /// <summary>
        /// A constructor for injecting the services.
        /// </summary>
        /// <param name="quizService">The quiz service, dependency injected.</param>
        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        /// <summary>
        /// Endpoint for creating a new quiz.
        /// </summary>
        /// <param name="model">The model for the quiz created by the user.</param>
        /// <returns>A new quiz if successful.</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateQuizViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.CreateAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for creating a new quizzes from a list of models.
        /// </summary>
        /// <param name="model">The model for the quiz created by the user.</param>
        /// <returns>A new quiz if successful.</returns>
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateBulk([FromBody] IEnumerable<CreateQuizViewModel> model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            IEnumerable<QuizDTO> res = await _quizService.CreateBulkAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting a quiz by it's ID.
        /// </summary>
        /// <param name="id">The quiz id.</param>
        /// <returns>A quiz if successful.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            QuizDTO res = await _quizService.GetAsync(userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting all quizzes that the user owns.
        /// </summary>
        /// <returns>A list of quizzes if successful.</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<QuizDTO> res = await _quizService.GetAllAsync(userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting all quizzes that the user owns in a certain group.
        /// </summary>
        /// <returns>A list of quizzes if successful.</returns>
        [HttpGet("group/{id}")]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] Guid id, [FromQuery] Guid? subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<QuizDTO> res = await _quizService.GetAllAsync(userId, id, subjectId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for updating a specific quiz that the user owns.
        /// </summary>
        /// <param name="model">The model for updating the quiz.</param>
        /// <param name="id">The id of the quiz.</param>
        /// <returns>An edited quiz if successful.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CreateQuizViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for deleting an array of quizzes by their IDs.
        /// </summary>
        /// <param name="ids">The array of quiz ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _quizService.DeleteAsync(ids, userId);
            return Ok();
        }

        /// <summary>
        /// Endpoint for adding questions and answers to a specific quiz.
        /// </summary>
        /// <param name="quizId">The ID of the quiz to add questions to.</param>
        /// <param name="questions">The questions and answers to add to the quiz.</param>
        /// <returns>The updated quiz with the new questions if successful.</returns>
        [HttpPost("{quizId}/questions")]
        public async Task<IActionResult> AddQuestionsToQuiz([FromRoute] Guid quizId, [FromBody] IEnumerable<CreateQuizQuestionViewModel> questions)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            QuizDTO res = await _quizService.AddQuestionsToQuizAsync(questions, userId, quizId);
            return Ok(res);
        }
    }
}
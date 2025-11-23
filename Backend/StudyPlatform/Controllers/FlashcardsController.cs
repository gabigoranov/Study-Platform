using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Data.Models;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;
using System.Collections.Generic;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages flashcards for the authenticated user.
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
    public class FlashcardsController : ControllerBase
    {
        private readonly IFlashcardsService _flashcardsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="flashcardsService">The flashcards service, dependency injected.</param>
        public FlashcardsController(IFlashcardsService flashcardsService)
        {
            _flashcardsService = flashcardsService;
        }

        /// <summary>
        /// Creates flashcard.
        /// </summary>
        /// <param name="model">The model used to create a new flashcard.</param>
        /// <returns>The created flashcard.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(FlashcardDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateFlashcardViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            FlashcardDTO res = await _flashcardsService.CreateAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Creates multiple flashcards.
        /// </summary>
        /// <param name="model">The model used to create new flashcards.</param>
        /// <returns>The created flashcards.</returns>
        [HttpPost("bulk")]
        [ProducesResponseType(typeof(IEnumerable<FlashcardDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateBulk([FromBody] IEnumerable<CreateFlashcardViewModel> model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            IEnumerable<FlashcardDTO> res = await _flashcardsService.CreateBulkAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Gets a flashcard by its ID.
        /// </summary>
        /// <param name="id">The id of the flashcard to retrieve.</param>
        /// <returns>The retrieved flashcard.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(FlashcardDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            FlashcardDTO res = await _flashcardsService.GetAsync(userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Gets all of user's flashcards.
        /// </summary>
        /// <returns>All of the user's flashcards.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FlashcardDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<FlashcardDTO> res = await _flashcardsService.GetAllAsync(userId);
            return Ok(res);
        }

        /// <summary>
        /// Gets all of user's flashcards in a certain group.
        /// </summary>
        /// <param name="id">The groupId used to retrieve flashcards.</param>
        /// <param name="subjectId">The subjectId used to retrieve flashcards.</param>
        /// <returns>The retrieved flashcards.</returns>
        [HttpGet("group/{id}")]
        [ProducesResponseType(typeof(IEnumerable<FlashcardDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] Guid id, [FromQuery] Guid subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<FlashcardDTO> res = await _flashcardsService.GetAllAsync(userId, id, subjectId);
            return Ok(res);
        }

        /// <summary>
        /// Updates flashcard.
        /// </summary>
        /// <param name="model">The model used to update a flashcard.</param>
        /// <param name="id">The model id.</param>
        /// <returns>The updated flashcard.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(FlashcardDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] CreateFlashcardViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            FlashcardDTO res = await _flashcardsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Deletes multiple flashcards IDs.
        /// </summary>
        /// <param name="ids">A list of flashcard ids to delete.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _flashcardsService.DeleteAsync(ids, userId);
            return Ok();
        }

        /// <summary>
        /// Generates flashcards from a file url via microservice.
        /// </summary>
        /// <param name="model">The model used to generate new flashcards with AI.</param>
        /// <returns>The generated flashcards.</returns>
        [HttpPost("generate")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(IEnumerable<GeneratedFlashcardDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Generate([FromBody] GenerateFlashcardsViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            List<GeneratedFlashcardDTO> res = await _flashcardsService.GenerateAsync(userId, model);

            return Ok(res);
        }
    }
}

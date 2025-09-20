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
    /// Provides endpoints for managing flashcards.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FlashcardsController : ControllerBase
    {
        private readonly IFlashcardsService _flashcardsService;

        /// <summary>
        /// A constructor for injecting the services.
        /// </summary>
        /// <param name="flashcardsService">The flashcards service, dependency injected.</param>
        public FlashcardsController(IFlashcardsService flashcardsService)
        {
            _flashcardsService = flashcardsService;
        }

        /// <summary>
        /// Endpoint for creating a new flashcard.
        /// </summary>
        /// <param name="model">The model for the flashcard created by the user.</param>
        /// <returns>A new flashcard if successful.</returns>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFlashcardViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            FlashcardDTO res = await _flashcardsService.CreateAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for creating a new flashcards from a list of models.
        /// </summary>
        /// <param name="model">The model for the flashcard created by the user.</param>
        /// <returns>A new flashcard if successful.</returns>
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateBulk([FromBody] IEnumerable<CreateFlashcardViewModel> model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            IEnumerable<FlashcardDTO> res = await _flashcardsService.CreateBulkAsync(model, userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting a flashcard by it's ID.
        /// </summary>
        /// <param name="id">The card id..</param>
        /// <returns>A flashcard if successful.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            FlashcardDTO res = await _flashcardsService.GetAsync(userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting all flashcards that the user owns.
        /// </summary>
        /// <returns>A list of flashcards if successful.</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<FlashcardDTO> res = await _flashcardsService.GetAllAsync(userId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting all flashcards that the user owns in a certain group.
        /// </summary>
        /// <returns>A list of flashcards if successful.</returns>
        [HttpGet("group/{id}")]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] int id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<FlashcardDTO> res = await _flashcardsService.GetAllAsync(userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for updating a specific flashcard that the user owns.
        /// </summary>
        /// <param name="model">The model for updating the flashcard.</param>
        /// <param name="id">The id of the flashcard.</param>
        /// <returns>An edited flashcard if successful.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CreateFlashcardViewModel model, [FromRoute] int id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            FlashcardDTO res = await _flashcardsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for deleting an array of flashcards by their IDs.
        /// </summary>
        /// <param name="ids">The array of flashcard ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] int[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _flashcardsService.DeleteAsync(ids, userId);
            return NoContent();
        }

        /// <summary>
        /// Endpoint for generating flashcards from a file.
        /// </summary>
        /// <param name="model">The model containing the file's download url and other prompt data.</param>
        /// <returns>A list of flashcards if successful.</returns>
        [HttpPost("generate")]
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

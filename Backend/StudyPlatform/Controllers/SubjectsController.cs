using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Subjects;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages subjects for the authenticated user.
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
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectsService _subjectsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="subjectsService">The subjects service, dependency injected.</param>
        public SubjectsController(ISubjectsService subjectsService)
        {
            _subjectsService = subjectsService;
        }

        /// <summary>
        /// Gets all of user's subjects.
        /// </summary>
        /// <param name="includeGroups">Whether or not to include material sub groups with their materials.</param>
        /// <param name="includeGroupsSummary">Whether or not to include material sub groups without their materials.</param>
        /// <returns>A list of subjects.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SubjectDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSubjectsByUser([FromQuery] bool includeGroups = false, [FromQuery] bool includeGroupsSummary = false)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var subjects = await _subjectsService.GetByUserAsync(userId, includeGroups, includeGroupsSummary);
            return Ok(subjects);
        }

        /// <summary>
        /// Gets a single subject.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <returns>The subject if found.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SubjectDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSubject(Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var subject = await _subjectsService.GetByIdAsync(id, userId);
            if (subject == null) return NotFound();
            return Ok(subject);
        }

        /// <summary>
        /// Creates a new subject.
        /// </summary>
        /// <param name="model">The subject creation model.</param>
        /// <returns>The created subject.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(SubjectDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _subjectsService.CreateAsync(model, userId);
            return CreatedAtAction(nameof(GetSubject), new { id = created.Id }, created);
        }

        /// <summary>
        /// Deletes a subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSubject(Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var deleted = await _subjectsService.DeleteAsync(id, userId);
            if (!deleted) return NotFound();
            return Ok();
        }

        /// <summary>
        /// Updates a subject.
        /// </summary>
        /// <param name="model">The model for updating the subject.</param>
        /// <param name="id">The id of the subject.</param>
        /// <returns>An edited subject if successful.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(SubjectDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] CreateSubjectViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            SubjectDTO res = await _subjectsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }
    }
}

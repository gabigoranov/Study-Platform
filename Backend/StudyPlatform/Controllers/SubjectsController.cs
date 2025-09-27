using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Subjects;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// API controller for managing subjects.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectsService _service;

        /// <summary>
        /// Initializes a new instance of the <see cref="SubjectsController"/> class.
        /// </summary>
        /// <param name="service">The subjects service DI.</param>
        public SubjectsController(ISubjectsService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets all subjects for a user.
        /// </summary>
        /// <param name="includeGroups">Whether or not to include material sub groups with their materials.</param>
        /// <param name="includeGroupsSummary">Whether or not to include material sub groups without their materials.</param>
        /// <returns>A list of subjects.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SubjectDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSubjectsByUser([FromQuery] bool includeGroups = false, [FromQuery] bool includeGroupsSummary = false)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var subjects = await _service.GetSubjectsByUserAsync(userId, includeGroups, includeGroupsSummary);
            return Ok(subjects);
        }

        /// <summary>
        /// Gets a single subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <returns>The subject if found.</returns>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(SubjectDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSubject(int id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var subject = await _service.GetSubjectByIdAsync(id, userId);
            if (subject == null) return NotFound();
            return Ok(subject);
        }

        /// <summary>
        /// Creates a new subject.
        /// </summary>
        /// <param name="model">The subject creation model.</param>
        /// <returns>The created subject.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(SubjectDto), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.CreateSubjectAsync(model, userId);
            return CreatedAtAction(nameof(GetSubject), new { id = created.Id }, created);
        }

        /// <summary>
        /// Deletes a subject by ID.
        /// </summary>
        /// <param name="id">The subject ID.</param>
        /// <returns>No content if deleted.</returns>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            var deleted = await _service.DeleteSubjectAsync(id, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}

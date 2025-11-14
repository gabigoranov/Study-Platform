using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.MaterialSubGroups;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// API controller for managing material subgroups.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MaterialSubGroupsController : ControllerBase
    {
        private readonly IMaterialSubGroupsService _service;

        /// <summary>
        /// Initializes the controller.
        /// </summary>
        /// <param name="service">The service DI.</param>
        public MaterialSubGroupsController(IMaterialSubGroupsService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets all material subgroups for a subject.
        /// </summary>
        /// <param name="subjectId">The subject ID.</param>
        /// <param name="includeMaterials">Whether or not to include the materials in each group.</param>
        /// <returns>A list of subgroups.</returns>
        [HttpGet("subject/{subjectId}")]
        [ProducesResponseType(typeof(IEnumerable<MaterialSubGroupDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBySubject(Guid subjectId, [FromQuery] bool includeMaterials = false)
        {
            Guid userId = User.GetUserId();
            var subGroups = await _service.GetAsync(subjectId, userId, includeMaterials);
            return Ok(subGroups);
        }

        /// <summary>
        /// Gets a single material subgroup by ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <returns>The subgroup if found.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MaterialSubGroupDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id)
        {
            Guid userId = User.GetUserId();
            var subGroup = await _service.GetByIdAsync(id, userId);
            if (subGroup == null) return NotFound();
            return Ok(subGroup);
        }

        /// <summary>
        /// Creates a new material subgroup.
        /// </summary>
        /// <param name="model">The subgroup creation model.</param>
        /// <returns>The created subgroup.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(MaterialSubGroupDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CreateMaterialSubGroupViewModel model)
        {
            Guid userId = User.GetUserId();
            var created = await _service.CreateAsync(model, userId);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        /// <summary>
        /// Deletes a material subgroup by ID.
        /// </summary>
        /// <param name="ids">The subgroup IDs.</param>
        /// <returns>No content if deleted.</returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            Guid userId = User.GetUserId();
            var deleted = await _service.DeleteAsync(ids, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Endpoint for updating a specific sub group that the user owns.
        /// </summary>
        /// <param name="model">The model for updating the sub group.</param>
        /// <param name="id">The id of the sub group.</param>
        /// <returns>An edited sub group if successful.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CreateMaterialSubGroupViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MaterialSubGroupDTO res = await _service.UpdateAsync(model, userId, id);
            return Ok(res);
        }
    }
}

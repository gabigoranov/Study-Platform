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
    /// Manages material sub groups for the authenticated user.
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
    public class MaterialSubGroupsController : ControllerBase
    {
        private readonly IMaterialSubGroupsService _groupsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="groupsService">The sub groups service, dependency injected.</param>
        public MaterialSubGroupsController(IMaterialSubGroupsService groupsService)
        {
            _groupsService = groupsService;
        }

        /// <summary>
        /// Gets all subgroups for a subject.
        /// </summary>
        /// <param name="subjectId">The subject ID.</param>
        /// <param name="includeMaterials">Whether or not to include the materials in each group.</param>
        /// <returns>A list of subgroups.</returns>
        [HttpGet("subject/{subjectId}")]
        [ProducesResponseType(typeof(IEnumerable<MaterialSubGroupDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBySubject(Guid subjectId, [FromQuery] bool includeMaterials = false)
        {
            Guid userId = User.GetUserId();
            var subGroups = await _groupsService.GetAsync(subjectId, userId, includeMaterials);
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
            var subGroup = await _groupsService.GetByIdAsync(id, userId);
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
            var created = await _groupsService.CreateAsync(model, userId);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        /// <summary>
        /// Deletes a material subgroup by ID.
        /// </summary>
        /// <param name="ids">The subgroup IDs.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            Guid userId = User.GetUserId();
            var deleted = await _groupsService.DeleteAsync(ids, userId);
            if (!deleted) return NotFound();
            return Ok();
        }

        /// <summary>
        /// Updates a specific sub group.
        /// </summary>
        /// <param name="model">The model for updating the sub group.</param>
        /// <param name="id">The id of the sub group.</param>
        /// <returns>An edited sub group if successful.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(MaterialSubGroupDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] CreateMaterialSubGroupViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MaterialSubGroupDTO res = await _groupsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }
    }
}

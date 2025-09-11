using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Models;
using StudyPlatform.Services.MaterialSubGroups;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// API controller for managing material subgroups.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
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
        /// <returns>A list of subgroups.</returns>
        [HttpGet("subject/{subjectId:int}")]
        [ProducesResponseType(typeof(IEnumerable<MaterialSubGroupDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBySubject(int subjectId)
        {
            Guid userId = User.GetUserId();
            var subGroups = await _service.GetSubGroupsBySubjectAsync(subjectId, userId);
            return Ok(subGroups);
        }

        /// <summary>
        /// Gets a single material subgroup by ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <returns>The subgroup if found.</returns>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(MaterialSubGroupDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(int id)
        {
            Guid userId = User.GetUserId();
            var subGroup = await _service.GetSubGroupByIdAsync(id, userId);
            if (subGroup == null) return NotFound();
            return Ok(subGroup);
        }

        /// <summary>
        /// Creates a new material subgroup.
        /// </summary>
        /// <param name="model">The subgroup creation model.</param>
        /// <returns>The created subgroup.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(MaterialSubGroupDto), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CreateMaterialSubGroupViewModel model)
        {
            Guid userId = User.GetUserId();
            var created = await _service.CreateSubGroupAsync(model, userId);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        /// <summary>
        /// Deletes a material subgroup by ID.
        /// </summary>
        /// <param name="id">The subgroup ID.</param>
        /// <returns>No content if deleted.</returns>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            Guid userId = User.GetUserId();
            var deleted = await _service.DeleteSubGroupAsync(id, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}

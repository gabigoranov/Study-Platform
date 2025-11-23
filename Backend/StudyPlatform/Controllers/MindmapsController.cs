using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Mindmaps;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages mindmaps for the authenticated user.
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
    public class MindmapsController : ControllerBase
    {
        private readonly IMindmapsService _mindmapsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="mindmapsService">The mindmaps service, dependency injected.</param>
        public MindmapsController(IMindmapsService mindmapsService)
        {
            _mindmapsService = mindmapsService;
        }


        /// <summary>
        /// Creates mindmap.
        /// </summary>
        /// <param name="model">The model used to create a new mindmap.</param>
        /// <returns>The created mindmap.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(MindmapDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateMindmapViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MindmapDTO res = await _mindmapsService.CreateAsync(model, userId);

            return Ok(res);
        }

        /// <summary>
        /// Gets all mindmaps for a subgroup or subject
        /// </summary>
        /// <returns>A list of mindmaps if successful.</returns>
        [HttpGet("group/{subGroupId}")]
        [ProducesResponseType(typeof(IEnumerable<MindmapDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] Guid subGroupId, [FromQuery] Guid subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<MindmapDTO> res = await _mindmapsService.GetAllAsync(userId, subGroupId, subjectId);
            return Ok(res);
        }

        /// <summary>
        /// Updates a mindmap.
        /// </summary>
        /// <param name="model">The model for updating the mindmap.</param>
        /// <param name="id">The id of the mindmap.</param>
        /// <returns>The updated mindmap.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(MindmapDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update([FromBody] CreateMindmapViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MindmapDTO res = await _mindmapsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

        /// <summary>
        /// Generates a mindmap.
        /// </summary>
        /// <param name="model">The model for generating the mindmap via AI microservice.</param>
        /// <returns>The generated mindmap.</returns>
        [ProducesResponseType(typeof(GeneratedMindmapDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GenerateMindmapsViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            GeneratedMindmapDTO res = await _mindmapsService.GenerateAsync(model, userId);

            return Ok(res);
        }

        /// <summary>
        /// Deletes multiple mindmaps by IDs.
        /// </summary>
        /// <param name="ids">The array of mindmap ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _mindmapsService.DeleteAsync(ids, userId);
            return Ok();
        }

        /// <summary>
        /// Deletes a mindmap by Id.
        /// </summary>
        /// <param name="id">Mindmap id.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteSingle([FromRoute] Guid id)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _mindmapsService.DeleteAsync([id], userId);
            return Ok();
        }
    }
}

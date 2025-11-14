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
    /// A controller responsible for handling all requests related to mindmaps.
    /// </summary>

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MindmapsController : ControllerBase
    {
        private readonly IMindmapsService _mindmapsService;

        /// <summary>
        /// Initializes the MindmapsController and injects dependencies.
        /// </summary>
        public MindmapsController(IMindmapsService mindmapsService)
        {
            _mindmapsService = mindmapsService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMindmapViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MindmapDTO res = await _mindmapsService.CreateAsync(model, userId);

            return Ok(res);
        }

        /// <summary>
        /// Endpoint for getting all mindmaps that the user owns in a certain group.
        /// </summary>
        /// <returns>A list of mindmaps if successful.</returns>
        [HttpGet("group/{subGroupId}")]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] Guid subGroupId, [FromQuery] Guid subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<MindmapDTO> res = await _mindmapsService.GetAllAsync(userId, subGroupId, subjectId);
            return Ok(res);
        }

        /// <summary>
        /// Endpoint for updating a specific mindmap that the user owns.
        /// </summary>
        /// <param name="model">The model for updating the mindmap.</param>
        /// <param name="id">The id of the mindmap.</param>
        /// <returns>An edited mindmap if successful.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CreateMindmapViewModel model, [FromRoute] Guid id)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            MindmapDTO res = await _mindmapsService.UpdateAsync(model, userId, id);
            return Ok(res);
        }

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
        /// Endpoint for deleting an array of mindmaps by their IDs.
        /// </summary>
        /// <param name="ids">The array of mindmap ids.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] Guid[] ids)
        {
            // Load userId from JWT tokens
            Guid userId = User.GetUserId();

            await _mindmapsService.DeleteAsync(ids, userId);
            return NoContent();
        }
    }
}

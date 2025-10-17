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

            return Ok();
        }

        /// <summary>
        /// Endpoint for getting all mindmaps that the user owns in a certain group.
        /// </summary>
        /// <returns>A list of mindmaps if successful.</returns>
        [HttpGet("group/{subGroupId}")]
        public async Task<IActionResult> GetAllFromGroup([FromRoute] int subGroupId, [FromQuery] int subjectId)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            IEnumerable<MindmapDTO> res = await _mindmapsService.GetAllAsync(userId, subGroupId, subjectId);
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
    }
}

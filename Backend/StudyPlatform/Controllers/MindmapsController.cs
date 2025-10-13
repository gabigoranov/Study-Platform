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

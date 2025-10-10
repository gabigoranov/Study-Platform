using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Models;
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
        public MindmapsController()
        {

        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GenerateMindmapsViewModel model)
        {
            throw new NotImplementedException();
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Users;

namespace StudyPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _service;

        public UsersController(IUsersService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string input)
        {
            var res = await _service.SearchAsync(input);
            return Ok(res);
        }

        [HttpPatch("score")]
        public async Task<IActionResult> UpdateScore([FromBody] UpdateScoreViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            AppUserDTO res = await _service.UpdateScoreAsync(userId, model.ModifyScoreBy);
            return Ok(res);
        }
    }
}

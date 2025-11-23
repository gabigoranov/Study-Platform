using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Users;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages app users.
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
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="usersService">The users service, dependency injected.</param>
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        /// <summary>
        /// Searches for users by input string.
        /// </summary>
        /// <returns>All of the found users.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AppUserDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search([FromQuery] string input)
        {
            var res = await _usersService.SearchAsync(input);
            return Ok(res);
        }

        /// <summary>
        /// Updates a user's score by a specified amount.
        /// </summary>
        /// <returns>The updated user model.</returns>
        [HttpPatch("score")]
        [ProducesResponseType(typeof(AppUserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateScore([FromBody] UpdateScoreViewModel model)
        {
            // Load userId from JWT token
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            AppUserDTO res = await _usersService.UpdateScoreAsync(userId, model.ModifyScoreBy);
            return Ok(res);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Data.Models;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Services.Friends;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Provides endpoints for managing friends and AppUser relationships.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendsController : ControllerBase
    {
        private readonly IFriendsService _service;

        /// <summary>
        /// A constructor for injecting the services.
        /// </summary>
        /// <param name="friendsService">The friends service, dependency injected.</param>
        public FriendsController(IFriendsService friendsService)
        {
            _service = friendsService;
        }

        /// <summary>
        /// Creates a friend request to another user.
        /// </summary>
        /// <param name="model">The model containing the user ID to send the friend request to.</param>
        /// <returns>The created friend request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(AppUserFriend), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateFriendRequest([FromBody] CreateFriendRequestViewModel model)
        {
            Guid userId = User.GetUserId();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var friendRequest = await _service.CreateFriendRequestAsync(userId, model.AddresseeId);
            return Ok(friendRequest);
        }

        /// <summary>
        /// Accepts a friend request from another user.
        /// </summary>
        /// <param name="id">The ID of the user who sent the friend request.</param>
        /// <returns>True if the request was accepted successfully.</returns>
        [HttpPatch("{id}/accept")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AcceptFriendRequest(Guid id)
        {
            Guid userId = User.GetUserId();

            var result = await _service.AcceptFriendRequestAsync(id, userId);
            
            return Ok(result);
        }

        /// <summary>
        /// Rejects a friend request from another user.
        /// </summary>
        /// <param name="id">The ID of the user who sent the friend request.</param>
        /// <returns>True if the request was rejected successfully.</returns>
        [HttpPatch("{id}/reject")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RejectFriendRequest(Guid id)
        {
            Guid userId = User.GetUserId();

            var result = await _service.RejectFriendRequestAsync(id, userId);
            if (!result) return NotFound();
            
            return Ok();
        }

        /// <summary>
        /// Deletes a friend relationship.
        /// </summary>
        /// <param name="id">The ID of the friend to remove.</param>
        /// <returns>True if the friend was deleted successfully.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteFriend(Guid id)
        {
            Guid userId = User.GetUserId();

            var result = await _service.DeleteFriendAsync(id, userId);
            if (!result) return NotFound();
            
            return Ok();
        }

        /// <summary>
        /// Gets all friend requests for the authenticated user.
        /// </summary>
        /// <returns>A list of all friends.</returns>
        [HttpGet("requests")]
        [ProducesResponseType(typeof(IEnumerable<AppUserFriend>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllFriendRequests()
        {
            Guid userId = User.GetUserId();

            var friendRequests = await _service.GetAllFriendRequestsAsync(userId);
            return Ok(friendRequests);
        }

        /// <summary>
        /// Gets all friends for the authenticated user.
        /// </summary>
        /// <returns>A list of all friends.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AppUserFriend>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllFriends()
        {
            Guid userId = User.GetUserId();

            var friendRequests = await _service.GetAllFriendsAsync(userId);
            return Ok(friendRequests);
        }
    }


}

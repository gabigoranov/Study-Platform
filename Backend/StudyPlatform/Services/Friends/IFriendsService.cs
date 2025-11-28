using StudyPlatform.Data.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Friends
{
    /// <summary>
    /// Defines methods for managing friends and AppUser relationships.
    /// </summary>
    public interface IFriendsService
    {
        /// <summary>
        /// Creates a friend request between two users.
        /// </summary>
        /// <param name="requesterId">The ID of the user sending the request.</param>
        /// <param name="addresseeId">The ID of the user receiving the request.</param>
        /// <returns>The created AppUserFriend relationship.</returns>
        Task<AppUserFriendDTO> CreateFriendRequestAsync(Guid requesterId, Guid addresseeId);

        /// <summary>
        /// Accepts a friend request.
        /// </summary>
        /// <param name="requesterId">The ID of the user sending the request.</param>
        /// <param name="addresseeId">The ID of the user receiving the request.</param>
        /// <returns>True if the request was accepted successfully, false otherwise.</returns>
        Task<AppUserFriendDTO> AcceptFriendRequestAsync(Guid requesterId, Guid addresseeId);

        /// <summary>
        /// Rejects a friend request.
        /// </summary>
        /// <param name="requesterId">The ID of the user sending the request.</param>
        /// <param name="addresseeId">The ID of the user receiving the request.</param>
        /// <returns>True if the request was rejected successfully, false otherwise.</returns>
        Task RejectFriendRequestAsync(Guid requesterId, Guid addresseeId);

        /// <summary>
        /// Deletes a friend relationship.
        /// </summary>
        /// <param name="friendId">The ID of the friend relationship.</param>
        /// <param name="userId">The ID of the user initiating the deletion.</param>
        /// <returns>True if the friend relationship was deleted successfully, false otherwise.</returns>
        Task DeleteFriendAsync(Guid friendId, Guid userId);

        /// <summary>
        /// Gets all friend requests for a user.
        /// </summary>
        /// <param name="userId">The ID of the user whose friend requests to retrieve.</param>
        /// <returns>A collection of AppUserFriend relationships.</returns>
        Task<IEnumerable<AppUserFriendDTO>> GetAllFriendRequestsAsync(Guid userId);

        /// <summary>
        /// Gets all friends for a user including themselves.
        /// </summary>
        /// <param name="userId">The ID of the user whose friends to retrieve.</param>
        /// <returns>A collection of AppUserFriend relationships.</returns>
        Task<IEnumerable<AppUserDTO>> GetAllFriendsAsync(Guid userId);
    }
}

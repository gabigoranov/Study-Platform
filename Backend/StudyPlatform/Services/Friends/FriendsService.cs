using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Friends
{
    /// <summary>
    /// Service for managing friends and AppUser relationships.
    /// </summary>
    public class FriendsService : IFriendsService
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;
        private readonly ILogger<FriendsService> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="FriendsService"/> class.
        /// </summary>
        public FriendsService(IRepository repo, ILogger<FriendsService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<AppUserFriendDTO> CreateFriendRequestAsync(Guid requesterId, Guid addresseeId)
        {
            if (requesterId == Guid.Empty) throw new ArgumentException("RequesterId can not be null or empty.");
            if (addresseeId == Guid.Empty) throw new ArgumentException("AddresseeId can not be null or empty.");
            if (requesterId == addresseeId) throw new ArgumentException("RequesterId and AddresseeId cannot be the same.");

            try
            {
                _logger.LogInformation("Creating friend request from user {RequesterId} to user {AddresseeId}", requesterId, addresseeId);

                // Check if a request already exists between these users
                var existingRequest = await _repo.AllReadonly<AppUserFriend>()
                    .FirstOrDefaultAsync(f => (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                                            (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

                if (existingRequest != null)
                {
                    _logger.LogWarning("Friend request already exists between users {RequesterId} and {AddresseeId}", requesterId, addresseeId);
                    throw new FriendRequestException("A friend request already exists between these users.");
                }

                var friendRequest = new AppUserFriend
                {
                    RequesterId = requesterId,
                    AddresseeId = addresseeId,
                    IsAccepted = false
                };

                await _repo.AddAsync(friendRequest);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Friend request created successfully from user {RequesterId} to user {AddresseeId}", requesterId, addresseeId);

                return _mapper.Map<AppUserFriendDTO>(friendRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating friend request from user {RequesterId} to user {AddresseeId}", requesterId, addresseeId);
                throw new FriendRequestException("Something went wrong while creating the friend request. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> AcceptFriendRequestAsync(Guid requesterId, Guid addresseeId)
        {
            if (requesterId == Guid.Empty) throw new ArgumentException("RequesterId can not be null or empty.");
            if (addresseeId == Guid.Empty) throw new ArgumentException("AddresseeId can not be null or empty.");

            try
            {
                _logger.LogInformation("Accepting friend request from user {Id} for user {UserId}", requesterId, addresseeId);

                // Look for a pending friend request where 'id' is the requester and 'userId' is the addressee
                var friendRequest = await _repo.All<AppUserFriend>()
                    .FirstOrDefaultAsync(f => f.RequesterId == requesterId && f.AddresseeId == addresseeId && !f.IsAccepted);

                if (friendRequest == null)
                {
                    _logger.LogWarning("Pending friend request from user {Id} to user {UserId} not found", requesterId, addresseeId);
                    return false;
                }

                friendRequest.IsAccepted = true;
                friendRequest.AcceptedAt = DateTime.UtcNow;

                await _repo.SaveChangesAsync();

                _logger.LogInformation("Friend request from user {Id} to user {UserId} accepted successfully", requesterId, addresseeId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accepting friend request from user {Id} to user {UserId}", requesterId, addresseeId);
                throw new FriendRequestException("Something went wrong while accepting the friend request. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> RejectFriendRequestAsync(Guid requesterId, Guid addresseeId)
        {
            if (requesterId == Guid.Empty) throw new ArgumentException("RequesterId can not be null or empty.");
            if (addresseeId == Guid.Empty) throw new ArgumentException("AddresseeId can not be null or empty.");

            try
            {
                _logger.LogInformation("Rejecting friend request from user {Id} for user {UserId}", requesterId, addresseeId);

                // Look for a pending friend request where 'id' is the requester and 'userId' is the addressee
                var friendRequest = await _repo.All<AppUserFriend>()
                    .FirstOrDefaultAsync(f => f.RequesterId == requesterId && f.AddresseeId == addresseeId && !f.IsAccepted);

                if (friendRequest == null)
                {
                    _logger.LogWarning("Pending friend request from user {Id} to user {UserId} not found", requesterId, addresseeId);
                    return false;
                }

                await _repo.DeleteAsync<AppUserFriend>(friendRequest);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Friend request from user {Id} to user {UserId} rejected successfully", requesterId, addresseeId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting friend request from user {Id} to user {UserId}", requesterId, addresseeId);
                throw new FriendRequestException("Something went wrong while rejecting the friend request. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> DeleteFriendAsync(Guid friendId, Guid userId)
        {
            if (friendId == Guid.Empty) throw new ArgumentException("FriendId can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Deleting friend relationship between user {Id} and user {UserId}", friendId, userId);

                // Look for an accepted friend relationship between the two users (in either direction)
                AppUserFriend? friendRelationship = await _repo.All<AppUserFriend>()
                    .FirstOrDefaultAsync(f => 
                        ((f.RequesterId == friendId && f.AddresseeId == userId) || 
                         (f.RequesterId == userId && f.AddresseeId == friendId)) && 
                        f.IsAccepted);

                if (friendRelationship == null)
                {
                    _logger.LogWarning("Accepted friend relationship between users {Id} and {UserId} not found", friendId, userId);
                    return false;
                }

                await _repo.DeleteAsync<AppUserFriend>(friendRelationship);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Friend relationship between users {Id} and {UserId} deleted successfully", friendId, userId);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting friend relationship between users {Id} and {UserId}", friendId, userId);
                throw new FriendRequestException("Something went wrong while deleting the friend relationship. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppUserFriendDTO>> GetAllFriendRequestsAsync(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving all friend requests for user {UserId}", userId);

                var requests = await _repo.AllReadonly<AppUserFriend>()
                    .Where(f => f.RequesterId == userId || f.AddresseeId == userId)
                    .ToListAsync();

                _logger.LogInformation("Found {FriendCount} friend requests for user {UserId}", requests.Count, userId);

                return _mapper.Map<IEnumerable<AppUserFriendDTO>>(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving friend requests for user {UserId}", userId);
                throw new FriendRequestException("Something went wrong while retrieving the friend requests. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppUserDTO>> GetAllFriendsAsync(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving all friends for user {UserId}", userId);

                // does not include subjects ( materials )
                var friends = await _repo.AllReadonly<AppUser>()
                    .Where(f => f.FriendsReceived.Any(x => (x.AddresseeId == userId || x.RequesterId == userId) && x.IsAccepted) || f.Id == userId)
                    .ToListAsync();

                _logger.LogInformation("Found {FriendCount} friends for user {UserId}", friends.Count, userId);

                return _mapper.Map<IEnumerable<AppUserDTO>>(friends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving friends for user {UserId}", userId);
                throw new FriendRequestException("Something went wrong while retrieving the friend requests. Please try again!", ex);
            }
        }
    }
}

using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
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

            return _mapper.Map<AppUserFriendDTO>(friendRequest);
        }

        /// <inheritdoc />
        public async Task<AppUserFriendDTO> AcceptFriendRequestAsync(Guid requesterId, Guid addresseeId)
        {
            if (requesterId == Guid.Empty) throw new ArgumentException("RequesterId can not be null or empty.");
            if (addresseeId == Guid.Empty) throw new ArgumentException("AddresseeId can not be null or empty.");

            // Look for a pending friend request where 'id' is the requester and 'userId' is the addressee
            var friendRequest = await _repo.All<AppUserFriend>()
                .FirstOrDefaultAsync(f => f.RequesterId == requesterId && f.AddresseeId == addresseeId && !f.IsAccepted);

            if (friendRequest == null)
            {
                _logger.LogWarning("Pending friend request from user {Id} to user {UserId} not found", requesterId, addresseeId);
                throw new KeyNotFoundException("No such friend request was found.");
            }

            friendRequest.IsAccepted = true;
            friendRequest.AcceptedAt = DateTime.UtcNow;

            await _repo.SaveChangesAsync();

            return _mapper.Map<AppUserFriendDTO>(friendRequest);
        }

        /// <inheritdoc />
        public async Task RejectFriendRequestAsync(Guid requesterId, Guid addresseeId)
        {
            if (requesterId == Guid.Empty) throw new ArgumentException("RequesterId can not be null or empty.");
            if (addresseeId == Guid.Empty) throw new ArgumentException("AddresseeId can not be null or empty.");

            // Look for a pending friend request where 'id' is the requester and 'userId' is the addressee
            var friendRequest = await _repo.All<AppUserFriend>()
                .FirstOrDefaultAsync(f => f.RequesterId == requesterId && f.AddresseeId == addresseeId && !f.IsAccepted);

            if (friendRequest == null)
            {
                _logger.LogWarning("Pending friend request from user {Id} to user {UserId} not found", requesterId, addresseeId);
                throw new KeyNotFoundException("No such friend request was found.");
            }

            await _repo.DeleteAsync<AppUserFriend>(friendRequest);
            await _repo.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task DeleteFriendAsync(Guid friendId, Guid userId)
        {
            if (friendId == Guid.Empty) throw new ArgumentException("FriendId can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            // Look for an accepted friend relationship between the two users (in either direction)
            int count = await _repo.All<AppUserFriend>()
                .Where(f =>
                    ((f.RequesterId == friendId && f.AddresseeId == userId) ||
                     (f.RequesterId == userId && f.AddresseeId == friendId)))
                .ExecuteDeleteAsync();

            if (count == 0)
                throw new KeyNotFoundException("Friend relationship not found.");
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppUserFriendDTO>> GetAllFriendRequestsAsync(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var requests = await _repo.AllReadonly<AppUserFriend>()
                .Include(x => x.Requester)
                .Include(x => x.Addressee)
                .Where(f => f.RequesterId == userId || f.AddresseeId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AppUserFriendDTO>>(requests);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AppUserDTO>> GetAllFriendsAsync(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            // does not include subjects ( materials )
            var friends = await _repo.AllReadonly<AppUser>()
                .Where(f => f.FriendsReceived.Any(x => (x.AddresseeId == userId || x.RequesterId == userId) && x.IsAccepted) || f.FriendsInitiated.Any(x => (x.AddresseeId == userId || x.RequesterId == userId) && x.IsAccepted) || f.Id == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AppUserDTO>>(friends);
        }
    }
}

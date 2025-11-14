using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;

namespace StudyPlatform.Services.Users
{
    public class UsersService : IUsersService
    {
        private readonly IRepository _repo;
        private readonly ILogger<UsersService> _logger;
        private readonly IMapper _mapper;

        public UsersService(IRepository repo, ILogger<UsersService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }


        /// <inheritdoc />
        public async Task<ICollection<AppUserDTO>> SearchAsync(string input)
        {
            if (string.IsNullOrEmpty(input))
                return [];

            var users = _repo.AllReadonly<AppUser>().Where(x => x.DisplayName.Contains(input) || x.Email.Contains(input));
            return _mapper.Map<ICollection<AppUserDTO>>(users);
        }
    }
}

using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Users
{
    public interface IUsersService
    {
        public Task<ICollection<AppUserDTO>> SearchAsync(string input);
    }
}

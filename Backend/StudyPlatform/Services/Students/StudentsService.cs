using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Students
{
    /// <inheritdoc />
    public class StudentsService : IStudentsService
    {
        private readonly IRepository _repo;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the StudentsService class with the specified repository and object mapper.
        /// </summary>
        /// <param name="repo">The repository used for accessing and managing student data.</param>
        /// <param name="mapper">The object mapper used for converting between data models and transfer objects.</param>
        public StudentsService(IRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<StudentDTO> UpdateScoreAsync(Guid userId, int modifyBy)
        {
            Student? user = await _repo.All<Student>().SingleOrDefaultAsync(x => x.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User with specified id not found");
            }

            user.Score += modifyBy;
            await _repo.SaveChangesAsync();

            return _mapper.Map<StudentDTO>(user);
        }
    }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Subjects
{
    /// <summary>
    /// Service for managing subjects.
    /// </summary>
    public class SubjectsService : ISubjectsService
    {
        private readonly IRepository _repo;
        private readonly ILogger<SubjectsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="SubjectsService"/> class.
        /// </summary>
        public SubjectsService(IRepository repo, ILogger<SubjectsService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SubjectDTO>> GetByUserAsync(Guid userId, bool includeGroups = false, bool includeGroupsSummary = false)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            IQueryable<Subject> query = _repo.AllReadonly<Subject>()
                    .Where(s => s.UserId == userId);

            if (includeGroupsSummary || includeGroups)
                query = query.Include(s => s.MaterialSubGroups);

            if (includeGroups)
                query = query.Include(s => s.MaterialSubGroups)
                             .ThenInclude(g => g.Materials);

            var entities = await query.ToListAsync();

            if (entities == null || !entities.Any())
                _logger.LogWarning("No subjects found for user {UserId}", userId);


            return _mapper.Map<IEnumerable<SubjectDTO>>(entities);
        }


        /// <inheritdoc />
        public async Task<SubjectDTO> GetByIdAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            var res = await _repo.AllReadonly<Subject>()
                    .Where(s => s.Id == id)
                    .FirstOrDefaultAsync();

            if (res == null)
            {
                _logger.LogWarning("Subject {SubjectId} not found", id);
                throw new KeyNotFoundException("Could not find the specified subject");
            }

            if (res.UserId != userId)
            {
                _logger.LogWarning("User {UserId} attempted to access subject {SubjectId} without permission", userId, id);
                throw new UnauthorizedAccessException("You do not have permission to access this subject");
            }

            return _mapper.Map<SubjectDTO>(res);
        }

        /// <inheritdoc />
        public async Task<SubjectDTO> CreateAsync(CreateSubjectViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentException("CreateSubject model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var subject = _mapper.Map<Subject>(model);
            subject.UserId = userId;
            subject.DateCreated = DateTimeOffset.UtcNow;

            await _repo.AddAsync<Subject>(subject);
            await _repo.SaveChangesAsync();

            return _mapper.Map<SubjectDTO>(subject);
        }



        /// <inheritdoc />
        public async Task DeleteAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            
            await _repo.ExecuteDeleteAsync<Subject>(f => f.Id == id && f.UserId == userId);
        }

        /// <inheritdoc />
        public async Task<SubjectDTO> UpdateAsync(CreateSubjectViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The subject model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentException("Id can not be null or empty.");

            var subject = await _repo.All<Subject>().FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (subject == null)
            {
                _logger.LogWarning("Subject {SubjectId} not found for user {UserId}", id, userId);
                throw new KeyNotFoundException("Could not find the requested subject.");
            }

            _mapper.Map(model, subject); 

            await _repo.SaveChangesAsync();

            return _mapper.Map<SubjectDTO>(subject);
        }
    }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyPlatform.Data;
using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Subjects
{
    /// <summary>
    /// Service for managing subjects.
    /// </summary>
    public class SubjectsService : ISubjectsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SubjectsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="SubjectsService"/> class.
        /// </summary>
        public SubjectsService(AppDbContext context, ILogger<SubjectsService> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SubjectDto>> GetSubjectsByUserAsync(Guid userId)
        {
            _logger.LogInformation("Retrieving all subjects for user {UserId}", userId);

            return await _context.Subjects
                .Where(s => s.UserId == userId)
                .ProjectTo<SubjectDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<SubjectDto?> GetSubjectByIdAsync(int id)
        {
            _logger.LogInformation("Retrieving subject {SubjectId}", id);

            return await _context.Subjects
                .Where(s => s.Id == id)
                .ProjectTo<SubjectDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        /// <inheritdoc />
        public async Task<SubjectDto> CreateSubjectAsync(CreateSubjectViewModel model, Guid userId)
        {
            _logger.LogInformation("Creating subject for user {UserId}", userId);

            var subject = _mapper.Map<Subject>(model);
            subject.UserId = userId;
            subject.DateCreated = DateTimeOffset.UtcNow;

            await _context.Subjects.AddAsync(subject);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Subject {SubjectId} created successfully for user {UserId}", subject.Id, userId);

            return _mapper.Map<SubjectDto>(subject);
        }

        /// <inheritdoc />
        public async Task<bool> DeleteSubjectAsync(int id, Guid userId)
        {
            _logger.LogInformation("Deleting subject {SubjectId} for user {UserId}", id, userId);

            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
            if (subject == null)
            {
                _logger.LogWarning("Subject {SubjectId} not found for user {UserId}", id, userId);
                return false;
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Subject {SubjectId} deleted successfully for user {UserId}", id, userId);

            return true;
        }
    }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyPlatform.Data;
using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.MaterialSubGroups
{
    /// <summary>
    /// Service for managing material subgroups.
    /// </summary>
    public class MaterialSubGroupsService : IMaterialSubGroupsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MaterialSubGroupsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="MaterialSubGroupsService"/> class.
        /// </summary>
        public MaterialSubGroupsService(AppDbContext db, ILogger<MaterialSubGroupsService> logger, IMapper mapper)
        {
            _context = db;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<MaterialSubGroupDto>> GetSubGroupsBySubjectAsync(int subjectId, Guid userId)
        {
            _logger.LogInformation("Retrieving subgroups for subject {SubjectId} and user {UserId}", subjectId, userId);

            return await _context.MaterialSubGroups
                .Where(sg => sg.SubjectId == subjectId && sg.Subject.UserId == userId)
                .ProjectTo<MaterialSubGroupDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDto?> GetSubGroupByIdAsync(int id, Guid userId)
        {
            _logger.LogInformation("Retrieving subgroup {SubGroupId} for user {UserId}", id, userId);

            return await _context.MaterialSubGroups
                .Where(sg => sg.Id == id && sg.Subject.UserId == userId)
                .ProjectTo<MaterialSubGroupDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDto> CreateSubGroupAsync(CreateMaterialSubGroupViewModel model, Guid userId)
        {
            _logger.LogInformation("Creating subgroup for subject {SubjectId} and user {UserId}", model.SubjectId, userId);

            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.Id == model.SubjectId && s.UserId == userId);
            if (subject == null)
            {
                _logger.LogWarning("Unauthorized attempt to create subgroup for subject {SubjectId} by user {UserId}", model.SubjectId, userId);
                throw new UnauthorizedAccessException("You do not own this subject.");
            }

            var subGroup = _mapper.Map<MaterialSubGroup>(model);
            subGroup.DateCreated = DateTimeOffset.UtcNow;

            await _context.MaterialSubGroups.AddAsync(subGroup);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Subgroup {SubGroupId} created successfully for user {UserId}", subGroup.Id, userId);

            return _mapper.Map<MaterialSubGroupDto>(subGroup);
        }

        /// <inheritdoc />
        public async Task<bool> DeleteSubGroupAsync(int id, Guid userId)
        {
            _logger.LogInformation("Deleting subgroup {SubGroupId} for user {UserId}", id, userId);

            var subGroup = await _context.MaterialSubGroups
                .Include(sg => sg.Subject)
                .FirstOrDefaultAsync(sg => sg.Id == id && sg.Subject.UserId == userId);

            if (subGroup == null)
            {
                _logger.LogWarning("Subgroup {SubGroupId} not found or unauthorized for user {UserId}", id, userId);
                return false;
            }

            _context.MaterialSubGroups.Remove(subGroup);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Subgroup {SubGroupId} deleted successfully for user {UserId}", id, userId);

            return true;
        }
    }
}

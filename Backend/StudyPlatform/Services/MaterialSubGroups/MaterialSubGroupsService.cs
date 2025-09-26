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

namespace StudyPlatform.Services.MaterialSubGroups
{
    /// <summary>
    /// Service for managing material subgroups.
    /// </summary>
    public class MaterialSubGroupsService : IMaterialSubGroupsService
    {
        private readonly IRepository _repo;
        private readonly ILogger<MaterialSubGroupsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="MaterialSubGroupsService"/> class.
        /// </summary>
        public MaterialSubGroupsService(IRepository repo, ILogger<MaterialSubGroupsService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<MaterialSubGroupDTO>> GetSubGroupsBySubjectAsync(int subjectId, Guid userId, bool includeMaterials = false)
        {
            if (subjectId < 0) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving subgroups for subject {SubjectId} and user {UserId}", subjectId, userId);

                var res = _repo.AllReadonly<MaterialSubGroup>().Where(sg => sg.SubjectId == subjectId && sg.Subject.UserId == userId);

                if (includeMaterials)
                    res = res.Include(sg => sg.Materials);

                var entities = await res.ToListAsync();

                return _mapper.Map<IEnumerable<MaterialSubGroupDTO>>(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving subgroups for subject {SubjectId} and user {UserId}: {Message}", subjectId, userId, ex.Message);
                throw new SubGroupFetchingException("Something went wrong while fetching the material sub groups. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO?> GetSubGroupByIdAsync(int id, Guid userId)
        {
            _logger.LogInformation("Retrieving subgroup {SubGroupId} for user {UserId}", id, userId);

            return await _repo.AllReadonly<MaterialSubGroup>()
                .Where(sg => sg.Id == id && sg.Subject.UserId == userId)
                .ProjectTo<MaterialSubGroupDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO> CreateSubGroupAsync(CreateMaterialSubGroupViewModel model, Guid userId)
        {
            _logger.LogInformation("Creating subgroup for subject {SubjectId} and user {UserId}", model.SubjectId, userId);

            var subject = await _repo.AllReadonly<Subject>().FirstOrDefaultAsync(s => s.Id == model.SubjectId && s.UserId == userId);
            if (subject == null)
            {
                _logger.LogWarning("Unauthorized attempt to create subgroup for subject {SubjectId} by user {UserId}", model.SubjectId, userId);
                throw new UnauthorizedAccessException("You do not own this subject.");
            }

            var subGroup = _mapper.Map<MaterialSubGroup>(model);
            subGroup.DateCreated = DateTimeOffset.UtcNow;

            await _repo.AddAsync<MaterialSubGroup>(subGroup);
            await _repo.SaveChangesAsync();

            _logger.LogInformation("Subgroup {SubGroupId} created successfully for user {UserId}", subGroup.Id, userId);

            return _mapper.Map<MaterialSubGroupDTO>(subGroup);
        }

        /// <inheritdoc />
        public async Task<bool> DeleteSubGroupAsync(int id, Guid userId)
        {
            _logger.LogInformation("Deleting subgroup {SubGroupId} for user {UserId}", id, userId);

            var subGroup = await _repo.AllReadonly<MaterialSubGroup>()
                .Include(sg => sg.Subject)
                .FirstOrDefaultAsync(sg => sg.Id == id && sg.Subject.UserId == userId);

            if (subGroup == null)
            {
                _logger.LogWarning("Subgroup {SubGroupId} not found or unauthorized for user {UserId}", id, userId);
                return false;
            }

            await _repo.DeleteAsync<MaterialSubGroup>(subGroup);
            await _repo.SaveChangesAsync();

            _logger.LogInformation("Subgroup {SubGroupId} deleted successfully for user {UserId}", id, userId);

            return true;
        }
    }
}

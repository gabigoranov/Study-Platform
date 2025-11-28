using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IEnumerable<MaterialSubGroupDTO>> GetAsync(Guid subjectId, Guid userId, bool includeMaterials = false)
        {
            if (subjectId == Guid.Empty) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var query = _repo.AllReadonly<MaterialSubGroup>().Include(x => x.Subject).Where(sg => sg.SubjectId == subjectId);

            if (!await query.AnyAsync())
            {
                _logger.LogWarning("No subgroups found for subject {SubjectId} and user {UserId}", subjectId, userId);
                throw new KeyNotFoundException("No material sub groups found for the given subject.");
            }

            // filter for authorization
            query = query.Where(x => x.Subject.UserId == userId);
            if (!await query.AnyAsync())
            {
                _logger.LogWarning("Unauthorized attempt to access subgroups for subject {SubjectId} by user {UserId}", subjectId, userId);
                throw new UnauthorizedAccessException("You do not own this subject.");
            }

            if (includeMaterials)
                query = query.Include(sg => sg.Materials);

            var entities = await query.ToListAsync();

            return _mapper.Map<IEnumerable<MaterialSubGroupDTO>>(entities);
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO?> GetByIdAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("MaterialSubGroupId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var entity = await _repo.AllReadonly<MaterialSubGroup>()
                .Include(x => x.Subject)
                .FirstOrDefaultAsync(sg => sg.Id == id);

            if (entity == null)
            {
                _logger.LogWarning("No subgroups found with ID {Id} and user {UserId}", id, userId);
                throw new KeyNotFoundException("No material sub groups found for the given subject.");
            }

            if (entity.Subject.UserId != userId)
            {
                _logger.LogWarning("Unauthorized attempt to access MaterialSubGroup {SubGroupId} by user {UserId}", id, userId);
                throw new UnauthorizedAccessException("You do not own this material sub group.");
            }

            return _mapper.Map<MaterialSubGroupDTO>(entity);
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO> CreateAsync(CreateMaterialSubGroupViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The sub group model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var subject = await _repo.AllReadonly<Subject>().FirstOrDefaultAsync(s => s.Id == model.SubjectId);
            if (subject == null)
            {
                _logger.LogWarning("No subgroups found with Subject ID {Id} and user {UserId}", model.SubjectId, userId);
                throw new KeyNotFoundException("No material sub groups found for the given subject.");
            }

            if(subject.UserId != userId)
            {
                _logger.LogWarning("Unauthorized attempt to acess Subject {Id} by user {UserId}", model.SubjectId, userId);
                throw new UnauthorizedAccessException("You do not own this material sub group.");
            }

            var subGroup = _mapper.Map<MaterialSubGroup>(model);
            subGroup.DateCreated = DateTimeOffset.UtcNow;

            await _repo.AddAsync<MaterialSubGroup>(subGroup);
            await _repo.SaveChangesAsync();

            return _mapper.Map<MaterialSubGroupDTO>(subGroup);
        }

        /// <inheritdoc />
        public async Task DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids.Length == 0) throw new ArgumentException("No sub group IDs provided.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var groups = await _repo.All<MaterialSubGroup>()
                                    .Include(x => x.Subject)
                                    .Where(f => ids.Contains(f.Id))
                                    .ToListAsync();

            if (groups.Count == 0)
            {
                _logger.LogWarning("No subgroups found for IDs {Ids}", ids);
                throw new KeyNotFoundException("No sub groups found for the specified IDs.");
            }

            var unauthorized = groups.Where(g => g.Subject.UserId != userId).ToList();
            if (unauthorized.Any())
            {
                _logger.LogWarning("Unauthorized attempt to delete subgroups {Ids} by user {UserId}", unauthorized.Select(g => g.Id), userId);
                throw new UnauthorizedAccessException("You do not own one or more of the specified sub groups.");
            }

            _repo.DeleteRange(groups);
            await _repo.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO> UpdateAsync(CreateMaterialSubGroupViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The sub group model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentException("Id can not be null or empty.");

            var subGroup = await _repo.All<MaterialSubGroup>()
                                      .Include(x => x.Subject)
                                      .FirstOrDefaultAsync(f => f.Id == id);

            if (subGroup == null)
            {
                _logger.LogWarning("Sub group {SubGroupId} not found", id);
                throw new KeyNotFoundException("Could not find the requested sub group.");
            }

            if (subGroup.Subject.UserId != userId)
            {
                _logger.LogWarning("Unauthorized attempt to update sub group {SubGroupId} by user {UserId}", id, userId);
                throw new UnauthorizedAccessException("You do not own this sub group.");
            }

            _mapper.Map(model, subGroup);
            await _repo.SaveChangesAsync();

            return _mapper.Map<MaterialSubGroupDTO>(subGroup);
        }
    }
}

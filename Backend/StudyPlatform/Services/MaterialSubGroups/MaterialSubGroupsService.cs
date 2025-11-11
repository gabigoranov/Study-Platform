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
        public async Task<MaterialSubGroupDTO?> GetByIdAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("MaterialSubGroupId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving subgroup {SubGroupId} for user {UserId}", id, userId);


                return _mapper.Map<MaterialSubGroupDTO>(await _repo.AllReadonly<MaterialSubGroup>()
                    .FirstOrDefaultAsync(sg => sg.Id == id && sg.Subject.UserId == userId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving subgroup with Id {Id} for user {UserId}: {Message}", id, userId, ex.Message);
                throw new SubGroupFetchingException("Something went wrong while fetching the material sub groups. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO> CreateAsync(CreateMaterialSubGroupViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The sub group model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating subgroup for subject {SubjectId} and user {UserId}", model.SubjectId, userId);

                bool subjectExists = await _repo.AllReadonly<Subject>().AnyAsync(s => s.Id == model.SubjectId && s.UserId == userId);
                if (!subjectExists)
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
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save MaterialSubGroup for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new sub group to the database.", ex);
            }     
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating subgroup for user {UserId}: {Message}", userId, ex.Message);
                throw new SubGroupCreationException("Something went wrong while creating the material sub groups. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids.Length <= 0) throw new ArgumentException("MaterialSubGroupId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Deleting subgroups {SubGroupId} for user {UserId}", ids, userId);

                var groups = await _repo.All<MaterialSubGroup>()
                .Where(f => ids.Contains(f.Id) && f.Subject.UserId == userId)
                .ToListAsync();

                if (groups == null)
                {
                    _logger.LogWarning("Subgroup {SubGroupId} not found or unauthorized for user {UserId}", ids, userId);
                    return false;
                }

                _repo.DeleteRange<MaterialSubGroup>(groups);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Subgroup {SubGroupId} deleted successfully for user {UserId}", ids, userId);

                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save MaterialSubGroup deletion for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the deletion of the sub group to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not delete MaterialSubGroup for user {UserId}", userId);
                throw new DbUpdateException("Failed to delete the sub group. Please try again!", ex);
            }
           
        }

        /// <inheritdoc />
        public async Task<MaterialSubGroupDTO> UpdateAsync(CreateMaterialSubGroupViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The sub group model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentNullException("Id can not be null or empty.");

            try
            {
                _logger.LogInformation("Editing sub group {sub groupId} for user {UserId}", id, userId);

                var subGroup = await _repo.All<MaterialSubGroup>().FirstOrDefaultAsync(f => f.Id == id && f.Subject.UserId == userId);

                if (subGroup == null)
                {
                    _logger.LogWarning("sub group {sub groupId} not found for user {UserId}", id, userId);
                    throw new KeyNotFoundException("Could not find the requested sub group.");
                }

                _mapper.Map(model, subGroup); // maps updated fields from ViewModel to entity

                await _repo.SaveChangesAsync();

                _logger.LogInformation("sub group {sub groupId} edited successfully for user {UserId}", subGroup.Id, userId);

                return _mapper.Map<MaterialSubGroupDTO>(subGroup);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not update sub group for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not update sub group for user {UserId}", userId);
                throw new MaterialUpdateException("Something went wrong while updating the new material. Please try again!", ex);
            }
        }
    }
}

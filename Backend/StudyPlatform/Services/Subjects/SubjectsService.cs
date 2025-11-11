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
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving all subjects for user {UserId}", userId);

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
            catch (Exception ex)
            {
                _logger.LogError("Error retrieving subjects for user {UserId}: {Message}", userId, ex.Message);
                throw new SubjectFetchingException("Something went wrong while fetching the subjects. Please try again!", ex);
            }
        }


        /// <inheritdoc />
        public async Task<SubjectDTO> GetByIdAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Retrieving subject {SubjectId}", id);

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
            catch (Exception ex) when (ex is not KeyNotFoundException && ex is not UnauthorizedAccessException)
            {
                _logger.LogError(ex, "Error retrieving subjects for user {UserId}", userId);
                throw new SubjectFetchingException("Something went wrong while fetching the subjects. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SubjectDTO> CreateAsync(CreateSubjectViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentException("CreateSubject model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            
            try
            {
                _logger.LogInformation("Creating subject for user {UserId}", userId);

                var subject = _mapper.Map<Subject>(model);
                subject.UserId = userId;
                subject.DateCreated = DateTimeOffset.UtcNow;

                await _repo.AddAsync<Subject>(subject);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Subject {SubjectId} created successfully for user {UserId}", subject.Id, userId);

                return _mapper.Map<SubjectDTO>(subject);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Subject for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new subject to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new subject for user {UserId}", userId);
                throw new SubjectCreationException("Something went wrong while creating the subject. Please try again!", ex);
            }

            
        }



        /// <inheritdoc />
        public async Task<bool> DeleteAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty) throw new ArgumentException("SubjectId can not be less than zero.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Deleting subject {SubjectId} for user {UserId}", id, userId);

                await _repo.ExecuteDeleteAsync<Subject>(f => f.Id == id && f.UserId == userId);

                _logger.LogInformation("Subject {SubjectId} deleted successfully for user {UserId}", id, userId);

                return true;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not delete Subject for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new deletion to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting subject for user {UserId}", userId);
                throw new SubjectCreationException("Something went wrong while deleting the subject. Please try again!", ex);
            }

        }

        /// <inheritdoc />
        public async Task<SubjectDTO> UpdateAsync(CreateSubjectViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The subject model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentNullException("Id can not be null or empty.");

            try
            {
                _logger.LogInformation("Editing subject {SubjectId} for user {UserId}", id, userId);

                var subject = await _repo.All<Subject>().FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

                if (subject == null)
                {
                    _logger.LogWarning("Subject {SubjectId} not found for user {UserId}", id, userId);
                    throw new KeyNotFoundException("Could not find the requested subject.");
                }

                _mapper.Map(model, subject); // maps updated fields from ViewModel to entity

                await _repo.SaveChangesAsync();

                _logger.LogInformation("Subject {SubjectId} edited successfully for user {UserId}", subject.Id, userId);

                return _mapper.Map<SubjectDTO>(subject);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not update Subject for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not update Subject for user {UserId}", userId);
                throw new MaterialUpdateException("Something went wrong while updating the new material. Please try again!", ex);
            }
        }
    }
}

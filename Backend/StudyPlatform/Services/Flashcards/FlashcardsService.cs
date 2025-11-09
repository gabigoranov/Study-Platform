using AutoMapper;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using System.Diagnostics;
using System.Net.Http;
using System.Text.Json;

namespace StudyPlatform.Services.Flashcards
{
    /// <summary>
    /// Service for managing flashcards: create, edit, retrieve, and delete.
    /// </summary>
    public class FlashcardsService : IFlashcardsService
    {
        private readonly IRepository _repo;
        private readonly ILogger<FlashcardsService> _logger;
        private readonly IMapper _mapper;
        private readonly HttpClient _client;


        /// <summary>
        /// Initializes a new instance of the <see cref="FlashcardsService"/> class.
        /// </summary>
        /// <param name="repo">The Repository instance.</param>
        /// <param name="logger">The logger instance.</param>
        /// <param name="mapper">The AutoMapper instance.</param>
        /// <param name="client">The HttpClient instance.</param>
        public FlashcardsService(IRepository repo, ILogger<FlashcardsService> logger, IMapper mapper, HttpClient client)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
            _client = client;
        }

        /// <summary>
        /// Creates a new flashcard for a specific user.
        /// </summary>
        /// <param name="model">The flashcard view model containing data.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <returns>The created <see cref="Flashcard"/>.</returns>
        public async Task<FlashcardDTO> CreateAsync(CreateFlashcardViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The flashcard model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating a flashcard for user {UserId}", userId);

                var flashcard = _mapper.Map<Flashcard>(model);
                flashcard.UserId = userId;

                await _repo.AddAsync<Flashcard>(flashcard);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Flashcard {FlashcardId} created successfully for user {UserId}", flashcard.Id, userId);

                return _mapper.Map<FlashcardDTO>(flashcard);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Flashcard for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not create Flashcard for user {UserId}", userId);
                throw new MaterialCreationException("Something went wrong while creating the new material. Please try again!", ex);
            }
        }

        /// <summary>
        /// Edits an existing flashcard for a specific user.
        /// </summary>
        /// <param name="model">The flashcard view model containing updated data.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <param name="id">The ID of the flashcard.</param>
        /// <returns>The updated <see cref="Flashcard"/>.</returns>
        public async Task<FlashcardDTO> UpdateAsync(CreateFlashcardViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The flashcard model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentNullException("Id can not be null or empty.");

            try
            {
                _logger.LogInformation("Editing flashcard {FlashcardId} for user {UserId}", id, userId);

                var flashcard = await _repo.All<Flashcard>().FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

                if (flashcard == null)
                {
                    _logger.LogWarning("Flashcard {FlashcardId} not found for user {UserId}", id, userId);
                    throw new KeyNotFoundException("Could not find the requested flashcard.");
                }

                _mapper.Map(model, flashcard); // maps updated fields from ViewModel to entity

                await _repo.SaveChangesAsync();

                _logger.LogInformation("Flashcard {FlashcardId} edited successfully for user {UserId}", flashcard.Id, userId);

                return _mapper.Map<FlashcardDTO>(flashcard);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not update Flashcard for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not update Flashcard for user {UserId}", userId);
                throw new MaterialUpdateException("Something went wrong while updating the new material. Please try again!", ex);
            }

        }

        /// <summary>
        /// Retrieves multiple flashcards by their IDs for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <param name="id">The ID of the flashcard.</param>
        /// <returns>A collection of <see cref="Flashcard"/> objects.</returns>
        public async Task<FlashcardDTO> GetAsync(Guid userId, Guid id)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                Flashcard? flashcards = await _repo.AllReadonly<Flashcard>()
                    .SingleAsync(f => f.Id == id && f.UserId == userId);

                if (flashcards == null)
                    throw new KeyNotFoundException("Could not find a flashcard with the specified Id and UserId."); 

                _logger.LogInformation("1 flashcard retrieved for user {UserId}", userId);
    
                return _mapper.Map<FlashcardDTO>(flashcards);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not fetch Flashcard for user {UserId}", userId);
                throw new MaterialFetchingException("Something went wrong while fetching the material. Please try again!", ex);
            }
        }

        /// <summary>
        /// Deletes multiple flashcards by their IDs for a specific user.
        /// </summary>
        /// <param name="ids">Array of flashcard IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <returns>A task representing the asynchronous delete operation.</returns>
        public async Task DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids == null || ids.Length == 0)
            {
                _logger.LogInformation("DeleteAsync called with empty or null IDs for user {UserId}", userId);
                throw new KeyNotFoundException("No flashcard IDs provided for deletion.");
            }
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                var flashcards = await _repo.All<Flashcard>()
                .Where(f => ids.Contains(f.Id) && f.UserId == userId)
                .ToListAsync();

                _repo.DeleteRange<Flashcard>(flashcards);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Flashcards deleted for user {UserId}", userId);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save changes for deleted Flashcards for user {UserId}", userId);
                throw new DbUpdateException("Failed to execute the deletion of the material from the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not delete Flashcards for user {UserId}", userId);
                throw new MaterialDeletionException("Something went wrong while deleting the material. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<FlashcardDTO>> GetAllAsync(Guid userId, Guid? groupId = null, Guid? subjectId = null)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (groupId == Guid.Empty) throw new ArgumentOutOfRangeException("GroupId can not be null or empty.");
            if (subjectId == Guid.Empty) throw new ArgumentOutOfRangeException("SubjectId can not be null or empty.");

            try
            {
                _logger.LogInformation("Fetching flashcards for user {UserId}", userId);
                var query = _repo.AllReadonly<Flashcard>().Where(x => x.UserId == userId);

                if(groupId != null)
                    query = query.Where(x => x.MaterialSubGroupId == groupId);

                if (subjectId != null)
                    query = query.Where(x => x.MaterialSubGroup.SubjectId == subjectId);

                var entities = await query.ToListAsync();   

                return _mapper.Map<IEnumerable<FlashcardDTO>>(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not fetch Flashcards for user {UserId}", userId);
                throw new MaterialFetchingException("Something went wrong while fetching the material. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<List<GeneratedFlashcardDTO>> GenerateAsync(Guid userId, GenerateFlashcardsViewModel model)
        {
            using var content = new MultipartFormDataContent();
            
            var response = await _client.PostAsJsonAsync($"{AppConstants.FLASHCARDS_MICROSERVICE_BASE_URL}/generate", model);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            if(jsonString == null) 
            {
                _logger.LogError("Failed to get a valid response from the flashcards microservice for user {UserId}", userId);
                throw new Exception("Failed to get a valid response from the flashcards microservice.");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Convert to list of FlashcardModel
            var flashcards = JsonSerializer.Deserialize<List<GeneratedFlashcardDTO>>(jsonString, options)
                 ?? new List<GeneratedFlashcardDTO>();

            return flashcards;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<FlashcardDTO>> CreateBulkAsync(IEnumerable<CreateFlashcardViewModel> model, Guid userId)
        {
            if(model == null || !model.Any()) throw new ArgumentNullException("The flashcards model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating {Count} flashcards for user {UserId}", model.Count(), userId);

                List<Flashcard> flashcards = new List<Flashcard>();
                await _repo.AddRangeAsync<Flashcard>(model.Select(m =>
                {
                    var flashcard = _mapper.Map<Flashcard>(m);
                    flashcard.UserId = userId;
                    flashcards.Add(flashcard);
                    return flashcard;
                }));

                await _repo.SaveChangesAsync();

                _logger.LogInformation("{Count} flashcards created successfully for user {UserId}", model.Count(), userId);

                return _mapper.Map<IEnumerable<FlashcardDTO>>(flashcards);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Flashcards for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not create Flashcards for user {UserId}", userId);
                throw new MaterialCreationException("Something went wrong while creating the new flashcards. Please try again!", ex);
            }
        }
    }
}

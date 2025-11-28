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


        /// <inheritdoc />
        public async Task<FlashcardDTO> CreateAsync(CreateFlashcardViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The flashcard model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var flashcard = _mapper.Map<Flashcard>(model);
            flashcard.UserId = userId;

            await _repo.AddAsync<Flashcard>(flashcard);
            await _repo.SaveChangesAsync();

            return _mapper.Map<FlashcardDTO>(flashcard);
        }

        /// <inheritdoc />
        public async Task<FlashcardDTO> UpdateAsync(CreateFlashcardViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The flashcard model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentException("Id can not be null or empty.");

            var flashcard = await _repo.All<Flashcard>().FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (flashcard == null)
            {
                _logger.LogWarning("Flashcard {FlashcardId} not found for user {UserId}", id, userId);
                throw new KeyNotFoundException("Could not find the requested flashcard.");
            }

            _mapper.Map(model, flashcard);

            await _repo.SaveChangesAsync();

            return _mapper.Map<FlashcardDTO>(flashcard);

        }

        /// <inheritdoc />
        public async Task<FlashcardDTO> GetAsync(Guid userId, Guid id)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            Flashcard? flashcard = await _repo.AllReadonly<Flashcard>()
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (flashcard == null)
                throw new KeyNotFoundException("Could not find a flashcard with the specified Id and UserId.");

            return _mapper.Map<FlashcardDTO>(flashcard);
        }

        /// <inheritdoc />
        public async Task DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids == null || ids.Length == 0)
            {
                _logger.LogWarning("DeleteAsync called with empty or null IDs for user {UserId}", userId);
                throw new KeyNotFoundException("No flashcard IDs provided for deletion.");
            }
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var flashcards = await _repo.All<Flashcard>()
            .Where(f => ids.Contains(f.Id) && f.UserId == userId)
            .ToListAsync();

            if (flashcards == null || flashcards.Count == 0)
            {
                _logger.LogWarning("No flashcards found to delete for user {UserId}", userId);
                throw new KeyNotFoundException("Could not find any flashcards with the specified IDs for deletion.");
            }

            _repo.DeleteRange<Flashcard>(flashcards);
            await _repo.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<FlashcardDTO>> GetAllAsync(Guid userId, Guid? groupId = null, Guid? subjectId = null)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var query = _repo.AllReadonly<Flashcard>().Where(x => x.UserId == userId);

            if (groupId != null)
                query = query.Where(x => x.MaterialSubGroupId == groupId);

            if (subjectId != null)
                query = query.Where(x => x.MaterialSubGroup.SubjectId == subjectId);

            var entities = await query.ToListAsync();

            return _mapper.Map<IEnumerable<FlashcardDTO>>(entities);
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
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            List<Flashcard> flashcards = new List<Flashcard>();
            await _repo.AddRangeAsync<Flashcard>(model.Select(m =>
            {
                var flashcard = _mapper.Map<Flashcard>(m);
                flashcard.UserId = userId;
                flashcards.Add(flashcard);
                return flashcard;
            }));

            await _repo.SaveChangesAsync();

            return _mapper.Map<IEnumerable<FlashcardDTO>>(flashcards);
        }
    }
}

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyPlatform.Data;
using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using System.Diagnostics;
using System.Net.Http;

namespace StudyPlatform.Services.Flashcards
{
    /// <summary>
    /// Service for managing flashcards: create, edit, retrieve, and delete.
    /// </summary>
    public class FlashcardsService : IFlashcardsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<FlashcardsService> _logger;
        private readonly IMapper _mapper;
        private const string MICROSERVICE_BASE_URL = "http://localhost:8000";
        private readonly HttpClient _client;


        /// <summary>
        /// Initializes a new instance of the <see cref="FlashcardsService"/> class.
        /// </summary>
        /// <param name="context">The database context.</param>
        /// <param name="logger">The logger instance.</param>
        /// <param name="mapper">The AutoMapper instance.</param>
        /// <param name="client">The HttpClient instance.</param>
        public FlashcardsService(AppDbContext context, ILogger<FlashcardsService> logger, IMapper mapper, HttpClient client)
        {
            _context = context;
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
            _logger.LogInformation("Creating a flashcard for user {UserId}", userId);

            var flashcard = _mapper.Map<Flashcard>(model);
            flashcard.UserId = userId;

            await _context.Flashcards.AddAsync(flashcard);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Flashcard {FlashcardId} created successfully for user {UserId}", flashcard.Id, userId);

            return _mapper.Map<FlashcardDTO>(flashcard);
        }

        /// <summary>
        /// Edits an existing flashcard for a specific user.
        /// </summary>
        /// <param name="model">The flashcard view model containing updated data.</param>
        /// <param name="userId">The ID of the user who owns the flashcard.</param>
        /// <param name="id">The ID of the flashcard.</param>
        /// <returns>The updated <see cref="Flashcard"/>.</returns>
        public async Task<FlashcardDTO> UpdateAsync(CreateFlashcardViewModel model, Guid userId, int id)
        {
            _logger.LogInformation("Editing flashcard {FlashcardId} for user {UserId}", id, userId);

            var flashcard = await _context.Flashcards
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (flashcard == null)
            {
                _logger.LogWarning("Flashcard {FlashcardId} not found for user {UserId}", id, userId);
                throw new KeyNotFoundException("Flashcard not found.");
            }

            _mapper.Map(model, flashcard); // maps updated fields from ViewModel to entity

            await _context.SaveChangesAsync();

            _logger.LogInformation("Flashcard {FlashcardId} edited successfully for user {UserId}", flashcard.Id, userId);

            return _mapper.Map<FlashcardDTO>(flashcard);
        }

        /// <summary>
        /// Retrieves multiple flashcards by their IDs for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <param name="id">The ID of the flashcard.</param>
        /// <returns>A collection of <see cref="Flashcard"/> objects.</returns>
        public async Task<FlashcardDTO> GetAsync(Guid userId, int id)
        {
            var flashcards = await _context.Flashcards
                .SingleAsync(f => f.Id == id && f.UserId == userId);

            _logger.LogInformation("1 flashcard retrieved for user {UserId}", userId);

            return _mapper.Map<FlashcardDTO>(flashcards);
        }

        /// <summary>
        /// Deletes multiple flashcards by their IDs for a specific user.
        /// </summary>
        /// <param name="ids">Array of flashcard IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the flashcards.</param>
        /// <returns>A task representing the asynchronous delete operation.</returns>
        public async Task DeleteAsync(int[] ids, Guid userId)
        {
            if (ids == null || ids.Length == 0)
            {
                _logger.LogInformation("DeleteAsync called with empty or null IDs for user {UserId}", userId);
                return;
            }

            int deletedCount = await _context.Flashcards
                .Where(f => ids.Contains(f.Id) && f.UserId == userId)
                .ExecuteDeleteAsync();

            _logger.LogInformation("{DeletedCount} flashcards deleted for user {UserId}", deletedCount, userId);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<FlashcardDTO>> GetAllAsync(Guid userId, int? groupId = null)
        {
            var flashcards = await _context.Flashcards.Where(x => groupId != null ? x.MaterialSubGroupId == groupId && x.UserId == userId : x.UserId == userId).ToListAsync();

            return _mapper.Map<IEnumerable<FlashcardDTO>>(flashcards);
        }

        /// <inheritdoc />
        public async Task<string> GenerateAsync(Guid userId, GenerateFlashcardsViewModel model)
        {

            using var content = new MultipartFormDataContent();
            
            var response = await _client.PostAsJsonAsync($"{MICROSERVICE_BASE_URL}/generate-flashcards", model);
            response.EnsureSuccessStatusCode();

            string text = await response.Content.ReadAsStringAsync();

            Debug.WriteLine(text);

            return text;
        }
    }
}

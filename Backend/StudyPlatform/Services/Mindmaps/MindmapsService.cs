using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace StudyPlatform.Services.Mindmaps
{
    public class MindmapsService : IMindmapsService
    {
        private readonly SupabaseRepository _repo;
        private readonly ILogger<MindmapsService> _logger;
        private readonly IMapper _mapper;
        private readonly HttpClient _client;

        /// <summary>
        /// Initializes the service and injects dependencies.
        /// </summary>
        /// <param name="repo"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="client"></param>
        public MindmapsService(SupabaseRepository repo, ILogger<MindmapsService> logger, IMapper mapper, HttpClient client)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
            _client = client;
        }

        /// <inheritdoc/>
        public async Task<MindmapDTO> CreateAsync(CreateMindmapViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The mindmap model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating a mindmap for user {UserId}", userId);

                var mindmap = _mapper.Map<Mindmap>(model);
                mindmap.UserId = userId;

                await _repo.AddAsync<Mindmap>(mindmap);
                await _repo.SaveChangesAsync();

                _logger.LogInformation("Mindmap {MindmapId} created successfully for user {UserId}", mindmap.Id, userId);

                return _mapper.Map<MindmapDTO>(mindmap);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Mindmap for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new material to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not create Mindmap for user {UserId}", userId);
                throw new MaterialCreationException("Something went wrong while creating the new material. Please try again!", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<GeneratedMindmapDTO> GenerateAsync(GenerateMindmapsViewModel model, Guid userId)
        {
            using var content = new MultipartFormDataContent();

            var response = await _client.PostAsJsonAsync($"{AppConstants.MINDMAPS_MICROSERVICE_BASE_URL}/generate", model);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            if (jsonString == null)
            {
                _logger.LogError("Failed to get a valid response from the mindmaps microservice for user {UserId}", userId);
                throw new Exception("Failed to get a valid response from the mindmaps microservice.");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Convert to list of FlashcardModel
            var mindmaps = JsonSerializer.Deserialize<GeneratedMindmapDTO>(jsonString, options)
                 ?? new GeneratedMindmapDTO();

            return mindmaps;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<MindmapDTO>> GetAllAsync(Guid userId, int? subGroupId, int? subjectId)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (subGroupId != null && subGroupId < 0) throw new ArgumentOutOfRangeException("GroupId must be greater than or equal to zero.");
            if (subjectId != null && subjectId < 0) throw new ArgumentOutOfRangeException("SubjectId must be greater than or equal to zero.");

            try
            {
                _logger.LogInformation("Fetching mindmaps for user {UserId}", userId);
                var query = _repo.AllReadonly<Mindmap>().Where(x => x.UserId == userId);

                if (subGroupId != null)
                    query = query.Where(x => x.MaterialSubGroupId == subGroupId);

                if (subjectId != null)
                    query = query.Where(x => x.SubjectId == subjectId);

                var entities = await query.ToListAsync();

                return _mapper.Map<IEnumerable<MindmapDTO>>(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not fetch Flashcards for user {UserId}", userId);
                throw new MaterialFetchingException("Something went wrong while fetching the material. Please try again!", ex);
            }
        }
    }
}

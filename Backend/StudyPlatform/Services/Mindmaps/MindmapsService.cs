using AutoMapper;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;
using System.Text.Json;

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
    }
}

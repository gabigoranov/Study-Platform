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
using System.Text.Json;

namespace StudyPlatform.Services.Quiz
{
    /// <summary>
    /// Service for managing quizzes: create, edit, retrieve, and delete.
    /// </summary>
    public class QuizService : IQuizService
    {
        private readonly IRepository _repo;
        private readonly ILogger<QuizService> _logger;
        private readonly IMapper _mapper;
        private readonly HttpClient _client;

        /// <summary>
        /// Initializes a new instance of the <see cref="QuizService"/> class.
        /// </summary>
        /// <param name="repo">The Repository instance.</param>
        /// <param name="logger">The logger instance.</param>
        /// <param name="mapper">The AutoMapper instance.</param>
        public QuizService(IRepository repo, ILogger<QuizService> logger, IMapper mapper, HttpClient client)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
            _client = client;
        }

        /// <summary>
        /// Creates a new quiz for a specific user.
        /// </summary>
        /// <param name="model">The quiz view model containing data.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        public async Task<QuizDTO> CreateAsync(CreateQuizViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The quiz model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var quiz = _mapper.Map<StudyPlatform.Data.Models.Quiz>(model);
            quiz.UserId = userId;
            quiz.DateCreated = DateTimeOffset.UtcNow;

            // Add quiz to the database first to get its ID
            await _repo.AddAsync<StudyPlatform.Data.Models.Quiz>(quiz);

            // Ensure no more than one answer is correct
            if (quiz.Questions.Any(x => x.Answers.Where(x => x.IsCorrect).Count() > 1))
            {
                _logger.LogError("Could not create quiz for user {UserId}", userId);
                throw new ArgumentException("QuizQuestion can not have more than 1 correct asnwer.");
            }

            await _repo.SaveChangesAsync();

            return _mapper.Map<QuizDTO>(quiz);
        }

        /// <inheritdoc />
        public async Task<QuizDTO> UpdateAsync(CreateQuizViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The quiz model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentException("Id can not be null or empty.");

            var quiz = await _repo.All<StudyPlatform.Data.Models.Quiz>()
                .Include(x => x.Questions)
                    .ThenInclude(x => x.Answers)
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quiz == null)
            {
                _logger.LogWarning("Quiz {QuizId} not found for user {UserId}", id, userId);
                throw new KeyNotFoundException("Could not find the requested quiz.");
            }

            _mapper.Map(model, quiz); 

            await _repo.SaveChangesAsync();

            return _mapper.Map<QuizDTO>(quiz);
        }

        /// <inheritdoc />
        public async Task<QuizDTO> GetAsync(Guid userId, Guid id)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var quiz = await _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.Answers)
                    .SingleAsync(q => q.Id == id && q.UserId == userId);

            if (quiz == null)
            {
                _logger.LogWarning("Quiz {QuizId} not found for user {UserId}", id, userId);
                throw new KeyNotFoundException("Could not find a quiz with the specified Id and UserId.");
            }

            return _mapper.Map<QuizDTO>(quiz);
        }

        /// <inheritdoc />
        public async Task DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids == null || ids.Length == 0)
            {
                _logger.LogWarning("DeleteAsync called with empty or null IDs for user {UserId}", userId);
                throw new KeyNotFoundException("No quiz IDs provided for deletion.");
            }
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var quizzes = await _repo.All<StudyPlatform.Data.Models.Quiz>()
                .Where(q => ids.Contains(q.Id) && q.UserId == userId)
                .ToListAsync();

            // Delete related questions and answers first
            var questionIds = quizzes.SelectMany(q => q.Questions).Select(qq => qq.Id).ToList();
            if (questionIds.Any())
            {
                var answers = await _repo.All<QuizQuestionAnswer>()
                    .Where(qqa => questionIds.Contains(qqa.QuizQuestionId))
                    .ToListAsync();
                _repo.DeleteRange<QuizQuestionAnswer>(answers);

                var questions = await _repo.All<QuizQuestion>()
                    .Where(qq => questionIds.Contains(qq.Id))
                    .ToListAsync();
                _repo.DeleteRange<QuizQuestion>(questions);
            }

            _repo.DeleteRange<StudyPlatform.Data.Models.Quiz>(quizzes);
            await _repo.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<QuizDTO>> GetAllAsync(Guid userId, Guid? groupId = null, Guid? subjectId = null)
        {
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            var query = _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                .Include(q => q.Questions)
                    .ThenInclude(qq => qq.Answers)
                .Where(x => x.UserId == userId);

            if (groupId != Guid.Empty && groupId != null)
                query = query.Where(x => x.MaterialSubGroupId == groupId);

            if (subjectId != Guid.Empty && subjectId != null)
                query = query.Where(x => x.MaterialSubGroup.SubjectId == subjectId);

            var entities = await query.ToListAsync();

            return _mapper.Map<IEnumerable<QuizDTO>>(entities);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<QuizDTO>> CreateBulkAsync(IEnumerable<CreateQuizViewModel> model, Guid userId)
        {
            if(model == null || !model.Any()) throw new ArgumentNullException("The quizzes model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");

            List<QuizDTO> quizDtos = new List<QuizDTO>();
            foreach (var quizModel in model)
            {
                var quizDto = await CreateAsync(quizModel, userId);
                quizDtos.Add(quizDto);
            }

            return quizDtos;
        }

        /// <inheritdoc />
        public async Task<QuizDTO> AddQuestionsToQuizAsync(IEnumerable<CreateQuizQuestionViewModel> questions, Guid userId, Guid quizId)
        {
            if (questions == null) throw new ArgumentNullException("Questions model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentException("UserId can not be null or empty.");
            if (quizId == Guid.Empty) throw new ArgumentException("QuizId can not be null or empty.");

            // First, verify that the quiz exists and belongs to the user
            var quiz = await _repo.All<StudyPlatform.Data.Models.Quiz>().Include(x => x.Questions).ThenInclude(x => x.Answers)
                .FirstOrDefaultAsync(q => q.Id == quizId && q.UserId == userId);

            if (quiz == null)
            {
                _logger.LogWarning("Quiz {QuizId} not found for user {UserId}", quizId, userId);
                throw new KeyNotFoundException("Could not find the requested quiz.");
            }

            // Process each question and its answers
            foreach (var questionModel in questions)
            {
                var question = _mapper.Map<QuizQuestion>(questionModel);
                question.QuizId = quizId;

                // Add the question first
                await _repo.AddAsync<QuizQuestion>(question);

                // Ensure no more than one answer is correct
                if (question.Answers.Where(x => x.IsCorrect).Count() > 1)
                {
                    _logger.LogError("Could not add questions to quiz {QuizId} for user {UserId}", quizId, userId);
                    throw new ArgumentException("QuizQuestion can not have more than 1 correct asnwer.");
                }

                await _repo.SaveChangesAsync();
            }

            return _mapper.Map<QuizDTO>(quiz);
        }

        /// <inheritdoc />
        public async Task DeleteQuestionAsync(Guid id, Guid userId)
        {
            if (id == Guid.Empty)
            {
                _logger.LogInformation("DeleteQuestionAsync called with empty or null IDs for user {UserId}", userId);
                throw new ArgumentException("No quiz IDs provided for deletion.");
            }
            if (userId == Guid.Empty) throw new AggregateException("UserId can not be null or empty.");

            await _repo.ExecuteDeleteAsync<QuizQuestion>(x => x.Id == id);
            await _repo.SaveChangesAsync();
        }

        /// <inheritdoc />
        public async Task<GeneratedQuizDTO> GenerateAsync(Guid userId, GenerateQuizViewModel model)
        {
            using var content = new MultipartFormDataContent();

            var response = await _client.PostAsJsonAsync($"{AppConstants.QUIZZES_MICROSERVICE_BASE_URL}/generate", model);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            if (jsonString == null)
            {
                _logger.LogError("Failed to get a valid response from the flashcards microservice for user {UserId}", userId);
                throw new Exception("Failed to get a valid response from the flashcards microservice.");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            // Convert to list of FlashcardModel
            var quizzes = JsonSerializer.Deserialize<GeneratedQuizDTO>(jsonString, options)
                 ?? new GeneratedQuizDTO();

            return quizzes;
        }
    }
}
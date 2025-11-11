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

        /// <summary>
        /// Initializes a new instance of the <see cref="QuizService"/> class.
        /// </summary>
        /// <param name="repo">The Repository instance.</param>
        /// <param name="logger">The logger instance.</param>
        /// <param name="mapper">The AutoMapper instance.</param>
        public QuizService(IRepository repo, ILogger<QuizService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary>
        /// Creates a new quiz for a specific user.
        /// </summary>
        /// <param name="model">The quiz view model containing data.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <returns>The created <see cref="Quiz"/>.</returns>
        public async Task<QuizDTO> CreateAsync(CreateQuizViewModel model, Guid userId)
        {
            if (model == null) throw new ArgumentNullException("The quiz model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating a quiz for user {UserId}", userId);

                var quiz = _mapper.Map<StudyPlatform.Data.Models.Quiz>(model);
                quiz.UserId = userId;
                quiz.DateCreated = DateTimeOffset.UtcNow;

                // Add quiz to the database first to get its ID
                await _repo.AddAsync<StudyPlatform.Data.Models.Quiz>(quiz);
                await _repo.SaveChangesAsync();

                // Process questions and answers
                if (model.Questions != null && model.Questions.Any())
                {
                    var questionList = model.Questions.ToList();
                    foreach (var questionModel in questionList)
                    {
                        var question = _mapper.Map<QuizQuestion>(questionModel);
                        question.QuizId = quiz.Id;

                        // Add the question first
                        await _repo.AddAsync<QuizQuestion>(question);
                        await _repo.SaveChangesAsync();

                        // Add answers to this question
                        if (questionModel.Answers != null && questionModel.Answers.Any())
                        {
                            var answersToCreate = new List<QuizQuestionAnswer>();
                            var answersList = questionModel.Answers.ToList();
                            
                            // Create all answers for this question
                            foreach (var answerModel in answersList)
                            {
                                var answer = _mapper.Map<QuizQuestionAnswer>(answerModel);
                                answer.QuizQuestionId = question.Id;
                                answersToCreate.Add(answer);
                            }
                            
                            await _repo.AddRangeAsync<QuizQuestionAnswer>(answersToCreate);
                            await _repo.SaveChangesAsync();

                            // Now set the correct answer - we'll use the position in the list
                            // If the first answer in the ViewModel list should be the correct one
                            if (answersList.Count > 0)
                            {
                                var correctAnswerModel = answersList[0]; // Assuming first answer is correct
                                var correctAnswer = await _repo.All<QuizQuestionAnswer>()
                                    .FirstOrDefaultAsync(a => a.QuizQuestionId == question.Id && 
                                                              a.Description == correctAnswerModel.Description);
                                
                                if (correctAnswer != null)
                                {
                                    question.CorrectQuizQuestionAnswerId = correctAnswer.Id;
                                    _repo.Update<QuizQuestion>(question);
                                    await _repo.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }

                _logger.LogInformation("Quiz {QuizId} created successfully for user {UserId}", quiz.Id, userId);

                // Return the complete quiz with questions
                var createdQuiz = await _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.Answers)
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.CorrectQuizQuestionAnswer)
                    .FirstOrDefaultAsync(q => q.Id == quiz.Id);

                return _mapper.Map<QuizDTO>(createdQuiz);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Quiz for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new quiz to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not create Quiz for user {UserId}", userId);
                throw new MaterialCreationException("Something went wrong while creating the new quiz. Please try again!", ex);
            }
        }

        /// <summary>
        /// Edits an existing quiz for a specific user.
        /// </summary>
        /// <param name="model">The quiz view model containing updated data.</param>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <param name="id">The ID of the quiz.</param>
        /// <returns>The updated <see cref="Quiz"/>.</returns>
        public async Task<QuizDTO> UpdateAsync(CreateQuizViewModel model, Guid userId, Guid id)
        {
            if (model == null) throw new ArgumentNullException("The quiz model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (id == Guid.Empty) throw new ArgumentNullException("Id can not be null or empty.");

            try
            {
                _logger.LogInformation("Editing quiz {QuizId} for user {UserId}", id, userId);

                var quiz = await _repo.All<StudyPlatform.Data.Models.Quiz>().FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

                if (quiz == null)
                {
                    _logger.LogWarning("Quiz {QuizId} not found for user {UserId}", id, userId);
                    throw new KeyNotFoundException("Could not find the requested quiz.");
                }

                _mapper.Map(model, quiz); // maps updated fields from ViewModel to entity

                await _repo.SaveChangesAsync();

                // Handle questions and answers
                if (model.Questions != null)
                {
                    // Delete existing questions for this quiz
                    var existingQuestions = await _repo.All<QuizQuestion>()
                        .Include(qq => qq.Answers) // Include answers to properly delete them
                        .Where(qq => qq.QuizId == id)
                        .ToListAsync();
                    
                    if (existingQuestions.Any())
                    {
                        // Delete all related answers first
                        var allAnswers = existingQuestions.SelectMany(qq => qq.Answers).ToList();
                        if (allAnswers.Any())
                        {
                            _repo.DeleteRange<QuizQuestionAnswer>(allAnswers);
                        }
                        
                        _repo.DeleteRange<QuizQuestion>(existingQuestions);
                        await _repo.SaveChangesAsync();
                    }

                    // Add updated questions
                    foreach (var questionModel in model.Questions)
                    {
                        var question = _mapper.Map<QuizQuestion>(questionModel);
                        question.QuizId = id;

                        // Add the question first
                        await _repo.AddAsync<QuizQuestion>(question);
                        await _repo.SaveChangesAsync();

                        // Add answers to this question
                        if (questionModel.Answers != null && questionModel.Answers.Any())
                        {
                            var answersToCreate = new List<QuizQuestionAnswer>();
                            var answersList = questionModel.Answers.ToList();
                            
                            // Create all answers for this question
                            foreach (var answerModel in answersList)
                            {
                                var answer = _mapper.Map<QuizQuestionAnswer>(answerModel);
                                answer.QuizQuestionId = question.Id;
                                answersToCreate.Add(answer);
                            }
                            
                            await _repo.AddRangeAsync<QuizQuestionAnswer>(answersToCreate);
                            await _repo.SaveChangesAsync();

                            // Now set the correct answer 
                            if (answersList.Count > 0)
                            {
                                var correctAnswerModel = answersList[0]; // Assuming first answer is correct
                                var correctAnswer = await _repo.All<QuizQuestionAnswer>()
                                    .FirstOrDefaultAsync(a => a.QuizQuestionId == question.Id && 
                                                              a.Description == correctAnswerModel.Description);
                                
                                if (correctAnswer != null)
                                {
                                    question.CorrectQuizQuestionAnswerId = correctAnswer.Id;
                                    _repo.Update<QuizQuestion>(question);
                                    await _repo.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }

                _logger.LogInformation("Quiz {QuizId} edited successfully for user {UserId}", quiz.Id, userId);

                // Return the complete quiz with questions
                var updatedQuiz = await _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.Answers)
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.CorrectQuizQuestionAnswer)
                    .FirstOrDefaultAsync(q => q.Id == quiz.Id);

                return _mapper.Map<QuizDTO>(updatedQuiz);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not update Quiz for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the quiz update to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not update Quiz for user {UserId}", userId);
                throw new MaterialUpdateException("Something went wrong while updating the quiz. Please try again!", ex);
            }
        }

        /// <summary>
        /// Retrieves a quiz by its ID for a specific user.
        /// </summary>
        /// <param name="userId">The ID of the user who owns the quiz.</param>
        /// <param name="id">The ID of the quiz.</param>
        /// <returns>A <see cref="QuizDTO"/> object.</returns>
        public async Task<QuizDTO> GetAsync(Guid userId, Guid id)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                var quiz = await _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.Answers)
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.CorrectQuizQuestionAnswer)
                    .SingleAsync(q => q.Id == id && q.UserId == userId);

                if (quiz == null)
                    throw new KeyNotFoundException("Could not find a quiz with the specified Id and UserId.");

                _logger.LogInformation("Quiz retrieved for user {UserId}", userId);

                return _mapper.Map<QuizDTO>(quiz);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not fetch Quiz for user {UserId}", userId);
                throw new MaterialFetchingException("Something went wrong while fetching the quiz. Please try again!", ex);
            }
        }

        /// <summary>
        /// Deletes quizzes by their IDs for a specific user.
        /// </summary>
        /// <param name="ids">Array of quiz IDs to delete.</param>
        /// <param name="userId">The ID of the user who owns the quizzes.</param>
        /// <returns>A task representing the asynchronous delete operation.</returns>
        public async Task DeleteAsync(Guid[] ids, Guid userId)
        {
            if (ids == null || ids.Length == 0)
            {
                _logger.LogInformation("DeleteAsync called with empty or null IDs for user {UserId}", userId);
                throw new KeyNotFoundException("No quiz IDs provided for deletion.");
            }
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
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

                _logger.LogInformation("Quizzes deleted for user {UserId}", userId);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save changes for deleted Quizzes for user {UserId}", userId);
                throw new DbUpdateException("Failed to execute the deletion of the quiz from the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not delete Quizzes for user {UserId}", userId);
                throw new MaterialDeletionException("Something went wrong while deleting the quiz. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<QuizDTO>> GetAllAsync(Guid userId, Guid? groupId = null, Guid? subjectId = null)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");
            if (groupId == Guid.Empty) throw new ArgumentOutOfRangeException("GroupId can not be null or empty.");
            if (subjectId == Guid.Empty) throw new ArgumentOutOfRangeException("SubjectId can not be null or empty.");

            try
            {
                _logger.LogInformation("Fetching quizzes for user {UserId}", userId);
                var query = _repo.AllReadonly<StudyPlatform.Data.Models.Quiz>()
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.Answers)
                    .Include(q => q.Questions)
                        .ThenInclude(qq => qq.CorrectQuizQuestionAnswer)
                    .Where(x => x.UserId == userId);

                if(groupId != null)
                    query = query.Where(x => x.MaterialSubGroupId == groupId);

                if (subjectId != null)
                    query = query.Where(x => x.MaterialSubGroup.SubjectId == subjectId);

                var entities = await query.ToListAsync();

                return _mapper.Map<IEnumerable<QuizDTO>>(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not fetch Quizzes for user {UserId}", userId);
                throw new MaterialFetchingException("Something went wrong while fetching the quizzes. Please try again!", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<QuizDTO>> CreateBulkAsync(IEnumerable<CreateQuizViewModel> model, Guid userId)
        {
            if(model == null || !model.Any()) throw new ArgumentNullException("The quizzes model can not be null or empty.");
            if (userId == Guid.Empty) throw new ArgumentNullException("UserId can not be null or empty.");

            try
            {
                _logger.LogInformation("Creating {Count} quizzes for user {UserId}", model.Count(), userId);

                List<QuizDTO> quizDtos = new List<QuizDTO>();
                foreach (var quizModel in model)
                {
                    var quizDto = await CreateAsync(quizModel, userId);
                    quizDtos.Add(quizDto);
                }

                _logger.LogInformation("{Count} quizzes created successfully for user {UserId}", model.Count(), userId);

                return quizDtos;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError("Could not save Quizzes for user {UserId}", userId);
                throw new DbUpdateException("Failed to save the new quizzes to the database.", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not create Quizzes for user {UserId}", userId);
                throw new MaterialCreationException("Something went wrong while creating the new quizzes. Please try again!", ex);
            }
        }
    }
}
using AutoMapper;
using Castle.Core.Logging;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.EntityFrameworkCore;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.Common;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;
using StudyPlatform.Tests.Helpers;
using System.Linq.Expressions;

namespace StudyPlatformTests
{
    public class FlashcardsServiceTests
    {
        private readonly Mock<IRepository> _repoMock;
        private readonly Mock<ILogger<FlashcardsService>> _loggerMock;
        private readonly IMapper _mapper;
        private readonly Mock<HttpClient> _mockClient;

        private readonly FlashcardsService _service;

        public FlashcardsServiceTests()
        {
            var configuration = new MapperConfiguration(cfg => {
                cfg.AddProfile<StudyPlatform.Models.Common.AutoMapper>(); // your AutoMapper profile
            });
            _mapper = configuration.CreateMapper();

            _repoMock = TestData.GetMockRepository();
            _loggerMock = new Mock<ILogger<FlashcardsService>>();
            _mockClient = new Mock<HttpClient>();


            _service = new FlashcardsService(_repoMock.Object, _loggerMock.Object, _mapper, _mockClient.Object);
        }

        [Fact]
        public async Task CreateAsync_WithValidData_ReturnsFlashcardDTO()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var input = new Flashcard
            {
                Title = "Test Card",
                Front = "Q: What is 2+2?",
                Back = "A: 4",
                UserId = userId,
                MaterialSubGroupId = 1,
                Difficulty = Difficulty.Easy
            };

            var createViewModel = _mapper.Map<CreateFlashcardViewModel>(input);
            var flashcardDto = _mapper.Map<FlashcardDTO>(input);

            _repoMock.Setup(r => r.AddAsync(It.IsAny<Flashcard>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            FlashcardDTO result = await _service.CreateAsync(createViewModel, userId);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(flashcardDto, options => options.Excluding(x => x.Id));

            _repoMock.Verify(r => r.AddAsync(It.IsAny<Flashcard>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_WithNullModel_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreateAsync(null, Guid.NewGuid()));

            _repoMock.Verify(r => r.AddAsync(It.IsAny<Flashcard>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_WithValidData_ReturnsFlashcardDTO()
        {
            // Arrange
            // See the TestData for the Db setup
            var id = TestData.Flashcards.First().Id;
            var userId = TestData.Flashcards.First().UserId;
            var updateModel = new Flashcard
            {
                Id = id,
                Title = "Test Card",
                Front = "Q: What is 2+2?",
                Back = "A: 4",
                UserId = userId,
                MaterialSubGroupId = 1,
                Difficulty = Difficulty.Easy
            };

            var createViewModel = _mapper.Map<CreateFlashcardViewModel>(updateModel);
            var expectedDTO = _mapper.Map<FlashcardDTO>(updateModel);
            
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Flashcard>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            FlashcardDTO result = await _service.UpdateAsync(createViewModel, userId, 1);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(expectedDTO, options => options.Excluding(x => x.Id));

            _repoMock.Verify(r => r.All<Flashcard>(), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_WithNullModel_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.UpdateAsync(null, Guid.NewGuid(), 1));

            _repoMock.Verify(r => r.AddAsync(It.IsAny<Flashcard>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task GetAsync_WithValidData_ReturnsFlaschardDTO()
        {

           // Arrange
            var id = TestData.Flashcards.First().Id;
            var userId = TestData.Flashcards.First().UserId;
            var expectedDTO = _mapper.Map<FlashcardDTO>(TestData.Flashcards.First());

            // Act
            FlashcardDTO result = await _service.GetAsync(userId, id);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(expectedDTO);

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Once);
        }

        [Fact]
        public async Task GetAsync_WithInvalidData_ThrowsAnException()
        {
            //Arrange
            var id = 999; // Non-existent ID
            var userId = Guid.NewGuid(); // Non-existent UserId
            
            // Act & Assert
            await Assert.ThrowsAsync<MaterialFetchingException>(() => _service.GetAsync(userId, id));

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WithValidData_Completes()
        {
            // Arrange
            int[] ids = [TestData.Flashcards.First().Id];
            var userId = TestData.Flashcards.First().UserId;

            _repoMock.Setup(r => r.ExecuteDeleteAsync<Flashcard>(It.IsAny<Expression<Func<Flashcard, bool>>>()))
                .Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            await _service.DeleteAsync(ids, userId);

            // Assert
            _repoMock.Verify(r => r.ExecuteDeleteAsync<Flashcard>(It.IsAny<Expression<Func<Flashcard, bool>>>()), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_WithInvalidData_ThrowsException()
        {
            // Arrange
            var userId = TestData.Flashcards.First().UserId;

            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

            // Act
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteAsync(null, userId));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.DeleteAsync([1], Guid.Empty));

            // Assert
            _repoMock.Verify(r => r.All<Flashcard>(), Times.Never);
        }

        [Fact]
        public async Task GetAllAsync_WithValidUserId_ReturnsFlashcardDTOs()
        {
            // Arrange
            var userId = TestData.Flashcards.First().UserId;
            var expectedDTOs = _mapper.Map<IEnumerable<FlashcardDTO>>(TestData.Flashcards.Where(f => f.UserId == userId));

            // Act
            IEnumerable<FlashcardDTO> result = await _service.GetAllAsync(userId);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(expectedDTOs);

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_WithValidGroupId_ReturnsFlashcardDTOs()
        {
            // Arrange
            var userId = TestData.Flashcards.First().UserId;
            var groupId = TestData.Flashcards.First().MaterialSubGroupId;
            var expectedDTOs = _mapper.Map<IEnumerable<FlashcardDTO>>(TestData.Flashcards.Where(f => f.UserId == userId && f.MaterialSubGroupId == groupId));

            // Act
            IEnumerable<FlashcardDTO> result = await _service.GetAllAsync(userId, groupId);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(expectedDTOs);

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_WithValidSubjectId_ReturnsFlashcardDTOs()
        {
            // Arrange
            var userId = TestData.Flashcards.First().UserId;
            var subjectId = TestData.Flashcards.First().MaterialSubGroup.SubjectId;
            var expectedDTOs = _mapper.Map<IEnumerable<FlashcardDTO>>(TestData.Flashcards.Where(f => f.UserId == userId && f.MaterialSubGroup.SubjectId == subjectId));

            // Act
            IEnumerable<FlashcardDTO> result = await _service.GetAllAsync(userId, subjectId: subjectId);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(expectedDTOs);

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_WithInvalidData_ThrowsException()
        {
            // Arrange
            var userId = TestData.Flashcards.First().UserId;

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _service.GetAllAsync(userId, -1));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetAllAsync(Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<Flashcard>(), Times.Never);
        }

        //TODO: Create tests for GenerateAsync using the microservice.

        [Fact]
        public async Task CreateBulkAsync_WithValidData_ReturnsFlashcardDTOs()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var flashcards = new List<Flashcard>() { 
                new Flashcard()
                {
                    Title = "Test Card",
                    Front = "Q: What is 2+2?",
                    Back = "A: 4",
                    MaterialSubGroupId = 1,
                    Difficulty = Difficulty.Easy,
                    UserId = userId
                }
            };

            var input = _mapper.Map<IEnumerable<CreateFlashcardViewModel>>(flashcards);

            var capturedFlashcards = new List<Flashcard>();

            _repoMock
                .Setup(r => r.AddRangeAsync(It.IsAny<IEnumerable<Flashcard>>()))
                .Returns((IEnumerable<Flashcard> flashcards) =>
                {
                    capturedFlashcards.AddRange(flashcards); // capture them
                    return Task.CompletedTask;
                }); 
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);
            
            // Act
            IEnumerable<FlashcardDTO> result = await _service.CreateBulkAsync(input, userId);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(
                _mapper.Map<IEnumerable<FlashcardDTO>>(capturedFlashcards),
                options => options.Excluding(x => x.Id)
            );

            _repoMock.Verify(r => r.AddRangeAsync(It.IsAny<IEnumerable<Flashcard>>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateBulkAsync_WithInvalidData_ThrowsException()
        {
            // Arrange
            var userId = Guid.NewGuid();

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreateBulkAsync(null, userId));

            _repoMock.Verify(r => r.AddRangeAsync(It.IsAny<IEnumerable<Flashcard>>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}
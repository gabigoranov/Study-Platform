using AutoMapper;
using Castle.Core.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Services.Flashcards;
using StudyPlatform.Tests.Helpers;

namespace StudyPlatformTests
{
    public class FlashcardsServiceTests
    {
        private readonly Mock<IRepository> _repoMock;
        private readonly Mock<ILogger<FlashcardsService>> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<HttpClient> _mockClient;

        private readonly FlashcardsService _service;

        public FlashcardsServiceTests()
        {   
            _repoMock = TestData.GetMockRepository();
            _loggerMock = new Mock<ILogger<FlashcardsService>>();
            _mapperMock = new Mock<IMapper>();
            _mockClient = new Mock<HttpClient>();


            _service = new FlashcardsService(_repoMock.Object, _loggerMock.Object, _mapperMock.Object, _mockClient.Object);
        }

        [Fact]
        public void CreateAsync_WithCorrectData_ReturnsFlashcardDTO()
        {

        }
    }
}
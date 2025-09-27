using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.MaterialSubGroups;
using StudyPlatform.Services.Subjects;
using StudyPlatform.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyPlatformTests
{
    public class SubjectsServiceTests
    {
        private readonly Mock<IRepository> _repoMock;
        private readonly Mock<ILogger<SubjectsService>> _loggerMock;
        private readonly IMapper _mapper;

        private readonly ISubjectsService _service;

        public SubjectsServiceTests()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<StudyPlatform.Models.Common.AutoMapper>();
            });
            _mapper = configuration.CreateMapper();

            _repoMock = TestData.GetMockRepository();
            _loggerMock = new Mock<ILogger<SubjectsService>>();


            _service = new SubjectsService(_repoMock.Object, _loggerMock.Object, _mapper);
        }

        [Fact]
        public async Task GetSubjectsByUserAsync_WithValidData_ReturnsSubjectDTOs()
        {
            // Arrange
            Guid userId = TestData.Subjects.First().UserId;
            bool includeGroups = false;
            bool includeGroupsSummary = false;

            IEnumerable<Subject> subjects = TestData.Subjects.Where(x => x.UserId == userId);
            var expected = _mapper.Map<IEnumerable<SubjectDto>>(subjects);

            // Act
            var result = await _service.GetSubjectsByUserAsync(userId, includeGroups, includeGroupsSummary);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task GetSubjectsByUserAsync_WithInvalidData_ThrowsException()
        {
            // Arrange
            Guid userId = Guid.Empty;

            // Act
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetSubjectsByUserAsync(userId));

            // Assert
            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Never);
        }

        [Fact]
        public async Task GetSubjectsByUserAsync_WithIncludeGroupsSummary_ReturnsSubjectDTOsWithGroupSummary()
        {
            // Arrange
            Guid userId = TestData.Subjects.First().UserId;
            bool includeGroups = false;
            bool includeGroupsSummary = true;

            IEnumerable<Subject> subjects = TestData.Subjects.Where(x => x.UserId == userId);
            var expected = _mapper.Map<IEnumerable<SubjectDto>>(subjects);

            // Act
            IEnumerable<SubjectDto> result = await _service.GetSubjectsByUserAsync(userId, includeGroups, includeGroupsSummary);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            //TODO: SubjectDTO does not include groups for now, so skip that part of the test
            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task GetSubjectsByUserAsync_WithIncludeGroups_ReturnsSubjectDTOsWithGroup()
        {
            // Arrange
            Guid userId = TestData.Subjects.First().UserId;
            bool includeGroups = true;

            IEnumerable<Subject> subjects = TestData.Subjects.Where(x => x.UserId == userId);
            var expected = _mapper.Map<IEnumerable<SubjectDto>>(subjects);

            // Act
            IEnumerable<SubjectDto> result = await _service.GetSubjectsByUserAsync(userId, includeGroups);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            //TODO: SubjectDTO does not include groups for now, so skip that part of the test
            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task GetSubjectByIdAsync_WithValidId_ReturnsSubjectDTO()
        {
            // Arrange
            var subject = TestData.Subjects.First();
            var expected = _mapper.Map<SubjectDto>(subject);

            var subjectId = subject.Id;
            var userId = subject.UserId;

            // Act
            var result = await _service.GetSubjectByIdAsync(subjectId, userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task GetSubjectByIdAsync_WithInvalidId_ThrowsException()
        {
            // Arrange
            var subjectId = -1;
            var userId = Guid.Empty;

            // Act
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetSubjectByIdAsync(subjectId, userId));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetSubjectByIdAsync(1, userId));

            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetSubjectByIdAsync(999, Guid.NewGuid())); // will search for the non-existing subject once

            // Assert
            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task GetSubjectByIdAsync_WithUnauthorizedUserId_ThrowsException()
        {
            // Arrange
            var subject = TestData.Subjects.First();
            var expected = _mapper.Map<SubjectDto>(subject);

            var subjectId = subject.Id;
            var userId = Guid.NewGuid(); // not the owner

            // Act
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.GetSubjectByIdAsync(subjectId, userId));

            // Assert
            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
        }

        [Fact]
        public async Task CreateSubjectAsync_WithValidData_ReturnsSubjectDTO()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var model = new CreateSubjectViewModel
            {
                Title = "New Subject"
            };

            // Act
            var result = await _service.CreateSubjectAsync(model, userId);
            
            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be(model.Title);
            result.UserId.Should().Be(userId);

            _repoMock.Verify(r => r.AddAsync<Subject>(It.IsAny<Subject>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateSubjectAsync_WithInvalidData_ThrowsException()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var model = new CreateSubjectViewModel
            {
                Title = "New Subject"
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateSubjectAsync(null, userId));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreateSubjectAsync(model, Guid.Empty));
            
            _repoMock.Verify(r => r.AddAsync<Subject>(It.IsAny<Subject>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteSubjectAsync_WithValidData_ReturnsTrue()
        {
            Subject subject = TestData.Subjects.First();

            bool res = await _service.DeleteSubjectAsync(subject.Id, subject.UserId);

            res.Should().BeTrue();


            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
            _repoMock.Verify(r => r.DeleteAsync<Subject>(It.IsAny<Subject>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteSubjectAsync_WithInvalidData_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.DeleteSubjectAsync(-1, Guid.NewGuid()));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.DeleteSubjectAsync(1, Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Never);
            _repoMock.Verify(r => r.DeleteAsync<Subject>(It.IsAny<Subject>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteSubjectAsync_WithNonExistentId_ReturnsFalse()
        {
            bool res = await _service.DeleteSubjectAsync(999, Guid.NewGuid());

            res.Should().BeFalse();

            _repoMock.Verify(r => r.AllReadonly<Subject>(), Times.Once);
            _repoMock.Verify(r => r.DeleteAsync<Subject>(It.IsAny<Subject>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}

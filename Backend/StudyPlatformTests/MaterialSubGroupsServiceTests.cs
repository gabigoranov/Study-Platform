using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Data.Types;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Flashcards;
using StudyPlatform.Services.MaterialSubGroups;
using StudyPlatform.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudyPlatformTests
{
    public class MaterialSubGroupsServiceTests
    {
        private readonly Mock<IRepository> _repoMock;
        private readonly Mock<ILogger<MaterialSubGroupsService>> _loggerMock;
        private readonly IMapper _mapper;

        private readonly MaterialSubGroupsService _service;

        public MaterialSubGroupsServiceTests()
        {
            var configuration = new MapperConfiguration(cfg => {
                cfg.AddProfile<StudyPlatform.Models.Common.AutoMapper>(); // your AutoMapper profile
            });
            _mapper = configuration.CreateMapper();

            _repoMock = TestData.GetMockRepository();
            _loggerMock = new Mock<ILogger<MaterialSubGroupsService>>();


            _service = new MaterialSubGroupsService(_repoMock.Object, _loggerMock.Object, _mapper);
        }

        [Fact]
        public async Task GetSubGroupsBySubjectAsync_WithValidData_ReturnsMaterialSubGroupDTOs()
        {
            // Arrange
            var subjectId = TestData.Subjects[0].Id;
            var userId = TestData.Subjects.First(s => s.Id == subjectId).UserId;
            var includeMaterials = false;

            var groups = TestData.SubGroups.Where(s => s.SubjectId == subjectId);
            var expected = _mapper.Map<IEnumerable<MaterialSubGroupDTO>>(groups);

            // Act
            var result = await _service.GetSubGroupsBySubjectAsync(subjectId, userId, includeMaterials);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Once);
        }

        [Fact]
        public async Task GetSubGroupsBySubjectAsync_WithIncludedMaterials_ReturnsMaterialSubGroupDTOs()
        {
            // Arrange
            var subjectId = TestData.Subjects[0].Id;
            var userId = TestData.Subjects.First(s => s.Id == subjectId).UserId;
            var includeMaterials = true;

            var groups = TestData.SubGroups.Where(s => s.SubjectId == subjectId);

            // Act
            var result = await _service.GetSubGroupsBySubjectAsync(subjectId, userId, includeMaterials);

            // Assert
            result.Should().NotBeNull();
            result.Select(x => x.Materials).Should().NotBeNull();

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Once);
        }

        [Fact]
        public async Task GetSubGroupsBySubjectAsync_WithInvalidProps_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetSubGroupsBySubjectAsync(Guid.Empty, Guid.Empty));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetSubGroupsBySubjectAsync(Guid.Empty, Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Never);
        }

        [Fact]
        public async Task GetSubGroupById_WithValidData_ReturnsMaterialSubGroupDTO()
        {
            // Arrange
            var group = TestData.SubGroups.First();
            var expected = _mapper.Map<MaterialSubGroupDTO>(group);

            var subGroupId = group.Id;
            var userId = group.Subject.UserId;

            // Act
            var result = await _service.GetSubGroupByIdAsync(subGroupId, userId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expected);

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Once);
        }

        [Fact]
        public async Task GetSubGroupById_WithInvalidProps_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetSubGroupByIdAsync(Guid.Empty, Guid.Empty));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetSubGroupByIdAsync(Guid.Empty, Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Never);
        }

        [Fact]
        public async Task CreateSubGroupAsync_WithValidData_ReturnsMaterialSubGroupDTO()
        {
            // Arrange
            var subject = TestData.Subjects.First();
            var userId = subject.UserId;

            var model = new CreateMaterialSubGroupViewModel
            {
                Title = "New SubGroup",
                MaterialGroupType = MaterialGroupType.Flashcards,
                SubjectId = subject.Id
            };

            // Act
            var result = await _service.CreateSubGroupAsync(model, userId);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be(model.Title);
            result.MaterialGroupType.Should().Be(model.MaterialGroupType);
            result.SubjectId.Should().Be(model.SubjectId);

            _repoMock.Verify(r => r.AddAsync(It.IsAny<MaterialSubGroup>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateSubGroupAsync_WithInvalidProps_ThrowsException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreateSubGroupAsync(null, Guid.Empty));
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.CreateSubGroupAsync(new CreateMaterialSubGroupViewModel(), Guid.NewGuid()));

            _repoMock.Verify(r => r.AddAsync(It.IsAny<MaterialSubGroup>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task CreateSubGroupAsync_UnauthorizedAccess_ThrowsException()
        {
            // Arrange
            var subject = TestData.Subjects.First();
            var userId = Guid.NewGuid(); // Different user

            var model = new CreateMaterialSubGroupViewModel
            {
                Title = "New SubGroup",
                MaterialGroupType = MaterialGroupType.Flashcards,
                SubjectId = subject.Id
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.CreateSubGroupAsync(model, userId));

            _repoMock.Verify(r => r.AddAsync(It.IsAny<MaterialSubGroup>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteSubGroupAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var id = TestData.SubGroups.First().Id;
            var userId = TestData.SubGroups.First().Subject.UserId;

            // Act & Assert
            Assert.True(await _service.DeleteSubGroupAsync(id, userId));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Once);
            _repoMock.Verify(r => r.DeleteAsync<MaterialSubGroup>(It.IsAny<MaterialSubGroup>()), Times.Once);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteSubGroupsAsync_WithInvalidProps_ThrowsException()
        {
           // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.DeleteSubGroupAsync(Guid.Empty, Guid.Empty));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.DeleteSubGroupAsync(Guid.Empty, Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Never);
            _repoMock.Verify(r => r.DeleteAsync<MaterialSubGroup>(It.IsAny<MaterialSubGroup>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }

        [Fact]
        public async Task DeleteSubGroupsAsync_WithUnauthorizedAccess_ReturnsFalse()
        {

            // Arrange
            var id = TestData.SubGroups.First().Id;
            var userId = Guid.NewGuid(); // Different user ( Unauthorized )

            // Act & Assert
            Assert.False(await _service.DeleteSubGroupAsync(id, userId));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Once);
            _repoMock.Verify(r => r.DeleteAsync<MaterialSubGroup>(It.IsAny<MaterialSubGroup>()), Times.Never);
            _repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}

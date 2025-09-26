using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
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
            var subjectId = 1;
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
            var subjectId = 1;
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
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetSubGroupsBySubjectAsync(-1, Guid.Empty));
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.GetSubGroupsBySubjectAsync(1, Guid.Empty));

            _repoMock.Verify(r => r.AllReadonly<MaterialSubGroup>(), Times.Never);
        }

    }
}

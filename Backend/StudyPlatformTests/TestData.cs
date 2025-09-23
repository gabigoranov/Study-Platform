using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Moq;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;

namespace StudyPlatform.Tests.Helpers
{
    /// <summary>
    /// Provides in-memory test data and a reusable mock repository.
    /// </summary>
    public static class TestData
    {
        // ----------------- Subjects -----------------
        public static List<Subject> Subjects { get; } = new List<Subject>
        {
            new Subject
            {
                Id = 1,
                Title = "Math",
                UserId = Guid.NewGuid()
            },
            new Subject
            {
                Id = 2,
                Title = "History",
                UserId = Guid.NewGuid()
            }
        };

        // ----------------- MaterialSubGroups -----------------
        public static List<MaterialSubGroup> SubGroups { get; } = new List<MaterialSubGroup>
        {
            new MaterialSubGroup
            {
                Id = 1,
                Title = "Algebra",
                MaterialGroupType = Data.Types.MaterialGroupType.Flashcards,
                SubjectId = 1,
                Subject = Subjects.First(s => s.Id == 1)
            },
            new MaterialSubGroup
            {
                Id = 2,
                Title = "World War II",
                MaterialGroupType = Data.Types.MaterialGroupType.Flashcards,
                SubjectId = 2,
                Subject = Subjects.First(s => s.Id == 2)
            }
        };

        // Attach SubGroups to Subjects
        static TestData()
        {
            foreach (var subject in Subjects)
            {
                subject.MaterialSubGroups = SubGroups.Where(sg => sg.SubjectId == subject.Id).ToList();
            }

            foreach (var sg in SubGroups)
            {
                sg.Materials = Flashcards.Where(f => f.MaterialSubGroupId == sg.Id).Cast<Material>().ToList();
            }
        }

        // ----------------- Flashcards -----------------
        public static List<Flashcard> Flashcards { get; } = new List<Flashcard>
        {
            new Flashcard
            {
                Id = 1,
                Title = "Quadratic Formula",
                Front = "What is the quadratic formula?",
                Back = "x = (-b ± √(b²-4ac))/(2a)",
                UserId = Guid.NewGuid(),
                MaterialSubGroupId = 1,
                MaterialSubGroup = SubGroups.First(sg => sg.Id == 1),
                Difficulty = Difficulty.Medium
            },
            new Flashcard
            {
                Id = 2,
                Title = "WWII Start",
                Front = "When did World War II start?",
                Back = "1939",
                UserId = Guid.NewGuid(),
                MaterialSubGroupId = 2,
                MaterialSubGroup = SubGroups.First(sg => sg.Id == 2),
                Difficulty = Difficulty.Easy
            }
        };

        // ----------------- Reusable Mock Repository -----------------
        public static Mock<IRepository> GetMockRepository()
        {
            var repoMock = new Mock<IRepository>();

            // Generic All<T>() with no filter
            repoMock.Setup(r => r.All<Flashcard>()).Returns(Flashcards.AsQueryable());
            repoMock.Setup(r => r.All<MaterialSubGroup>()).Returns(SubGroups.AsQueryable());
            repoMock.Setup(r => r.All<Subject>()).Returns(Subjects.AsQueryable());

            // Generic All<T>(predicate)
            repoMock.Setup(r => r.All<Flashcard>(It.IsAny<Expression<Func<Flashcard, bool>>>()))
                .Returns((Expression<Func<Flashcard, bool>> pred) => Flashcards.AsQueryable().Where(pred.Compile()));
            repoMock.Setup(r => r.All<MaterialSubGroup>(It.IsAny<Expression<Func<MaterialSubGroup, bool>>>()))
                .Returns((Expression<Func<MaterialSubGroup, bool>> pred) => SubGroups.AsQueryable().Where(pred.Compile()));
            repoMock.Setup(r => r.All<Subject>(It.IsAny<Expression<Func<Subject, bool>>>()))
                .Returns((Expression<Func<Subject, bool>> pred) => Subjects.AsQueryable().Where(pred.Compile()));

            // Optional AddAsync
            repoMock.Setup(r => r.AddAsync(It.IsAny<Flashcard>())).Returns((Flashcard f) => Task.FromResult(f));
            repoMock.Setup(r => r.AddAsync(It.IsAny<MaterialSubGroup>())).Returns((MaterialSubGroup sg) => Task.FromResult(sg));
            repoMock.Setup(r => r.AddAsync(It.IsAny<Subject>())).Returns((Subject s) => Task.FromResult(s));

            return repoMock;
        }
    }
}

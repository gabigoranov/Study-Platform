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
                Id = Guid.NewGuid(),
                Title = "Math",
                UserId = Guid.NewGuid()
            },
            new Subject
            {
                Id = Guid.NewGuid(),
                Title = "History",
                UserId = Guid.NewGuid()
            }
        };

        // ----------------- MaterialSubGroups -----------------
        public static List<MaterialSubGroup> SubGroups { get; } = new List<MaterialSubGroup>
        {
            new MaterialSubGroup
            {
                Id = Guid.NewGuid(),
                Title = "Algebra",
                MaterialGroupType = Data.Types.MaterialGroupType.Flashcards,
                SubjectId = Subjects.First().Id,
                Subject = Subjects.First(),
            },
            new MaterialSubGroup
            {
                Id = Guid.NewGuid(),
                Title = "World War II",
                MaterialGroupType = Data.Types.MaterialGroupType.Flashcards,
                SubjectId = Subjects[1].Id,
                Subject = Subjects[1]
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
                Id = Guid.NewGuid(),
                Title = "Quadratic Formula",
                Front = "What is the quadratic formula?",
                Back = "x = (-b ± √(b²-4ac))/(2a)",
                UserId = Guid.NewGuid(),
                MaterialSubGroupId = SubGroups[0].Id,
                MaterialSubGroup = SubGroups[0],
                Difficulty = Difficulty.Medium
            },
            new Flashcard
            {
                Id = Guid.NewGuid(),
                Title = "WWII Start",
                Front = "When did World War II start?",
                Back = "1939",
                UserId = Guid.NewGuid(),
                MaterialSubGroupId = SubGroups[1].Id,
                MaterialSubGroup = SubGroups[1],
                Difficulty = Difficulty.Easy
            }
        };

        // ----------------- Reusable Mock Repository -----------------
        public static Mock<IRepository> GetMockRepository()
        {
            var repoMock = new Mock<IRepository>();

            // Helper to wrap lists into async queryables
            IQueryable<T> AsAsyncQueryable<T>(IEnumerable<T> source)
                where T : class =>
                new TestAsyncEnumerable<T>(source);

            // All<T>() no filter
            repoMock.Setup(r => r.All<Flashcard>()).Returns(AsAsyncQueryable(TestData.Flashcards));
            repoMock.Setup(r => r.All<MaterialSubGroup>()).Returns(AsAsyncQueryable(TestData.SubGroups));
            repoMock.Setup(r => r.All<Subject>()).Returns(AsAsyncQueryable(TestData.Subjects));

            // AllReadonly<T>() no filter
            repoMock.Setup(r => r.AllReadonly<Flashcard>()).Returns(AsAsyncQueryable(TestData.Flashcards));
            repoMock.Setup(r => r.AllReadonly<MaterialSubGroup>()).Returns(AsAsyncQueryable(TestData.SubGroups));
            repoMock.Setup(r => r.AllReadonly<Subject>()).Returns(AsAsyncQueryable(TestData.Subjects));

            // All<T>(predicate)
            repoMock.Setup(r => r.All<Flashcard>(It.IsAny<Expression<Func<Flashcard, bool>>>()))
                .Returns((Expression<Func<Flashcard, bool>> pred) =>
                    AsAsyncQueryable(TestData.Flashcards.Where(pred.Compile())));
            repoMock.Setup(r => r.All<MaterialSubGroup>(It.IsAny<Expression<Func<MaterialSubGroup, bool>>>()))
                .Returns((Expression<Func<MaterialSubGroup, bool>> pred) =>
                    AsAsyncQueryable(TestData.SubGroups.Where(pred.Compile())));
            repoMock.Setup(r => r.All<Subject>(It.IsAny<Expression<Func<Subject, bool>>>()))
                .Returns((Expression<Func<Subject, bool>> pred) =>
                    AsAsyncQueryable(TestData.Subjects.Where(pred.Compile())));

            // AllReadonly<T>(predicate)
            repoMock.Setup(r => r.AllReadonly<Flashcard>(It.IsAny<Expression<Func<Flashcard, bool>>>()))
                .Returns((Expression<Func<Flashcard, bool>> pred) =>
                    AsAsyncQueryable(TestData.Flashcards.Where(pred.Compile())));
            repoMock.Setup(r => r.AllReadonly<MaterialSubGroup>(It.IsAny<Expression<Func<MaterialSubGroup, bool>>>()))
                .Returns((Expression<Func<MaterialSubGroup, bool>> pred) =>
                    AsAsyncQueryable(TestData.SubGroups.Where(pred.Compile())));
            repoMock.Setup(r => r.AllReadonly<Subject>(It.IsAny<Expression<Func<Subject, bool>>>()))
                .Returns((Expression<Func<Subject, bool>> pred) =>
                    AsAsyncQueryable(TestData.Subjects.Where(pred.Compile())));

            // AddAsync
            repoMock.Setup(r => r.AddAsync(It.IsAny<Flashcard>())).Returns((Flashcard f) => Task.FromResult(f));
            repoMock.Setup(r => r.AddAsync(It.IsAny<MaterialSubGroup>())).Returns((MaterialSubGroup sg) => Task.FromResult(sg));
            repoMock.Setup(r => r.AddAsync(It.IsAny<Subject>())).Returns((Subject s) => Task.FromResult(s));

            return repoMock;
        }

    }
}

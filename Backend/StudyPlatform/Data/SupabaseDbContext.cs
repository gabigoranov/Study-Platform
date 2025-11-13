using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Models;

namespace StudyPlatform.Data
{
    public class SupabaseDbContext : DbContext
    {
        public SupabaseDbContext(DbContextOptions<SupabaseDbContext> options)
        : base(options) { }

        public DbSet<Mindmap> Mindmaps { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<MaterialSubGroup> MaterialSubGroups { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<Flashcard> Flashcards { get; set; } = null!;
        public DbSet<Quiz> Quizzes { get; set; } = null!;
        public DbSet<QuizQuestion> QuizQuestions { get; set; } = null!;
        public DbSet<QuizQuestionAnswer> QuizQuestionAnswers { get; set; } = null!;
        public DbSet<SupabaseUser> SupabaseUsers { get; set; } = null!;
        public DbSet<AppUser> AppUsers { get; set; } = null!;
        public DbSet<AppUserFriend> AppUsersFriends { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SupabaseUser>(entity =>
            {
                entity.ToTable("users", "auth", t => t.ExcludeFromMigrations());
            });

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.ToTable("app_users", "public");
                entity.HasKey(e => e.Id);

                entity.HasOne(a => a.AuthUser)
                      .WithOne()
                      .HasForeignKey<AppUser>(a => a.Id)
                      .HasPrincipalKey<SupabaseUser>(u => u.Id)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(x => x.Subjects)
                    .WithOne(x => x.User)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AppUserFriend>()
                .HasKey(f => new { f.RequesterId, f.AddresseeId });

            modelBuilder.Entity<AppUserFriend>()
                .HasOne(f => f.Requester)
                .WithMany(u => u.FriendsInitiated)
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<AppUserFriend>()
                .HasOne(f => f.Addressee)
                .WithMany(u => u.FriendsReceived)
                .HasForeignKey(f => f.AddresseeId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Mindmap>(entity =>
            {
                entity.Property(m => m.Data).HasColumnType("jsonb");

            });

            // Base Material table
            modelBuilder.Entity<Material>()
                .ToTable("Materials"); // optional, can keep base table

            // TPT: separate tables for derived types
            modelBuilder.Entity<Flashcard>().ToTable("Flashcards");
            modelBuilder.Entity<Mindmap>().ToTable("Mindmaps");
            modelBuilder.Entity<Quiz>().ToTable("Quizzes");

            // One-to-many: QuizQuestion → Answers
            modelBuilder.Entity<QuizQuestion>()
                .HasMany(q => q.Answers)
                .WithOne(a => a.QuizQuestion)
                .HasForeignKey(a => a.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}

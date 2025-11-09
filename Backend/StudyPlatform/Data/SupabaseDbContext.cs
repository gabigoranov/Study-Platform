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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}

using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace StudyPlatform.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

        public DbSet<Subject> Subjects { get; set; }
        public DbSet<MaterialSubGroup> MaterialSubGroups { get; set; }
        public DbSet<Material> Materials { get; set; }
        public DbSet<Flashcard> Flashcards { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Material>()
                .HasDiscriminator<string>("MaterialType")
                .HasValue<Flashcard>("Flashcard");

            modelBuilder.Entity<Flashcard>().ToTable("Materials");
        }
    }
}

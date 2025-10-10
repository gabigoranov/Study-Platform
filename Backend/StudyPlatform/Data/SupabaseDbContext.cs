using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Models;

namespace StudyPlatform.Data
{
    public class SupabaseDbContext : DbContext
    {
        public SupabaseDbContext(DbContextOptions<SupabaseDbContext> options)
        : base(options) { }

        public DbSet<Mindmap> Mindmaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Mindmap>(entity =>
            {
                entity.Property(m => m.Data).HasColumnType("jsonb");

            });
        }
    }
}

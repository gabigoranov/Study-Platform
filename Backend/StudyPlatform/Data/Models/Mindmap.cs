using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    [Index(nameof(UserId))] // Optional: creates an index on UserId
    public class Mindmap
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(30)]
        public string Title { get; set; }

        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        // Foreign keys to your SQL Server groups/subgroups (no actual navigation here)
        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int MaterialSubGroupId { get; set; }

        // Must match Supabase auth.users.id (UUID)
        [Column(TypeName = "uuid")]
        public Guid UserId { get; set; }

        // JSONB column mapping
        [Column(TypeName = "jsonb")]
        public JsonDocument Data { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public Difficulty Difficulty { get; set; } = Difficulty.Easy;
    }
}

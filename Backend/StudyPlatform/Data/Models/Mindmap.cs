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
        public Guid Id { get; set; } = Guid.NewGuid();

        // Foreign keys to your SQL Server groups/subgroups (no actual navigation here)
        public int GroupId { get; set; }
        public int SubgroupId { get; set; }

        // Must match Supabase auth.users.id (UUID)
        [Column(TypeName = "uuid")]
        public Guid UserId { get; set; }

        // JSONB column mapping
        [Column(TypeName = "jsonb")]
        public JsonDocument Data { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}

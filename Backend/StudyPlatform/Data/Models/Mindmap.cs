using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    [Index(nameof(UserId))] // Optional: creates an index on UserId
    public class Mindmap : Material
    {
        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        // JSONB column mapping
        [Column(TypeName = "jsonb")]
        public JsonDocument Data { get; set; }
    }
}

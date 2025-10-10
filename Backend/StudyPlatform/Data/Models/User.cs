namespace StudyPlatform.Data.Models
{
    /// <summary>
    /// PostgreSQL supabase auth.users table representation.
    /// </summary>
    public class User
    {
        public Guid Id { get; set; } // matches auth.users.id
        public string Email { get; set; }
    }
}

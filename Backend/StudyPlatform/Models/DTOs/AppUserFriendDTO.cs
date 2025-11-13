using StudyPlatform.Data.Models;

namespace StudyPlatform.Models.DTOs
{
    public class AppUserFriendDTO
    {
        public Guid RequesterId { get; set; }
        public Guid AddresseeId { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
    }
}

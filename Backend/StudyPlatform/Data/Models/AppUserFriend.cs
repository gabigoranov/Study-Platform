namespace StudyPlatform.Data.Models
{
    public class AppUserFriend
    {
        public Guid RequesterId { get; set; }
        public AppUser Requester { get; set; }

        public Guid AddresseeId { get; set; }
        public AppUser Addressee { get; set; }

        public bool IsAccepted { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
    }
}

namespace StudyPlatform.Data.Models
{
    public class AppUserFriend
    {
        public Guid RequesterId { get; set; }
        public Student Requester { get; set; }

        public Guid AddresseeId { get; set; }
        public Student Addressee { get; set; }

        public bool IsAccepted { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
    }
}

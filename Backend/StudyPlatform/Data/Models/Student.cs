using System.ComponentModel.DataAnnotations.Schema;

namespace StudyPlatform.Data.Models
{
    public class Student : AppUser
    {
        [Column("score")]
        public int Score { get; set; }

        // Sent friend requests
        public ICollection<AppUserFriend> FriendsInitiated { get; set; } = new List<AppUserFriend>();

        // Received friend requests
        public ICollection<AppUserFriend> FriendsReceived { get; set; } = new List<AppUserFriend>();
    }
}

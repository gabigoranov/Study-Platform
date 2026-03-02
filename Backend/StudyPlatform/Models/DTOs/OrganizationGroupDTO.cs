namespace StudyPlatform.Models.DTOs
{
    /// <summary>
    /// Data transfer object returned when working with organization groups.
    /// </summary>
    public class OrganizationGroupDTO
    {
        /// <summary>
        /// The unique identifier of the organization group.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The title of the organization group.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The ID of the organization this group belongs to.
        /// </summary>
        public int OrganizationId { get; set; }

        /// <summary>
        /// The number of users in this organization group.
        /// </summary>
        public int UsersCount { get; set; }
    }
}

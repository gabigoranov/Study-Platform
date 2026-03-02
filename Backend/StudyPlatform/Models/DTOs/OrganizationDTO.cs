namespace StudyPlatform.Models.DTOs
{
    /// <summary>
    /// Data transfer object returned when working with organizations.
    /// </summary>
    public class OrganizationDTO
    {
        /// <summary>
        /// The unique identifier of the organization.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The title of the organization.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The town where the organization is located.
        /// </summary>
        public string Town { get; set; } = string.Empty;

        /// <summary>
        /// The country where the organization is located.
        /// </summary>
        public string Country { get; set; } = string.Empty;

        /// <summary>
        /// The address of the organization.
        /// </summary>
        public string Address { get; set; } = string.Empty;

        /// <summary>
        /// The number of organization groups in this organization.
        /// </summary>
        public int OrganizationGroupsCount { get; set; }
    }
}

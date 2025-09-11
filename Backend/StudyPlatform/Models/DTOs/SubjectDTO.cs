namespace StudyPlatform.Models.DTOs
{
    /// <summary>
    /// Data transfer object returned when working with subjects.
    /// </summary>
    public class SubjectDto
    {
        /// <summary>
        /// The unique identifier of the subject.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The title of the subject.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The ID of the user who owns this subject.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// The UTC date when the subject was created.
        /// </summary>
        public DateTimeOffset DateCreated { get; set; }
    }
}

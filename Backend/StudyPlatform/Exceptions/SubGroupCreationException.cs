namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// Exception thrown when there is an error creating a material subgroup.
    /// </summary>
    public class SubGroupCreationException : Exception
    {
        /// <summary>
        /// Initializes the <see cref="SubGroupCreationException"/> class.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public SubGroupCreationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

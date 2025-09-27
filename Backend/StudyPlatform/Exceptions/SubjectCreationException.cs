namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// An exception thrown in case of an error during the creation of a subject
    /// </summary>
    public class SubjectCreationException : Exception
    {
        /// <summary>
        /// Initializes the <see cref="SubjectCreationException"/> class.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public SubjectCreationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

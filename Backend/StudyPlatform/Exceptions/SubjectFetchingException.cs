namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// An exception thrown in case of an error while fetching subjects.
    /// </summary>
    public class SubjectFetchingException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SubjectFetchingException"/> class.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public SubjectFetchingException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

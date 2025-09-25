namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// Exception thrown when there is an error during the fetching of study material.
    /// </summary>
    public class MaterialFetchingException : Exception
    {
        /// <summary>
        /// Initializes the exception instance.
        /// </summary>
        /// <param name="message">The text message.</param>
        /// <param name="innerException">The inner exception instance.</param>
        public MaterialFetchingException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

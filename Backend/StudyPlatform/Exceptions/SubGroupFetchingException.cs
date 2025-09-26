namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// An exception thrown in case of an unexpected error during the fetching of material subgroups.
    /// </summary>
    public class SubGroupFetchingException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SubGroupFetchingException"/> class.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public SubGroupFetchingException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

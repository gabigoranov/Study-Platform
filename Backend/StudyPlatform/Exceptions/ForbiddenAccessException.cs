namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// A custom excpetion for cases where a request does not have the right roles.
    /// </summary>
    public class ForbiddenAccessException : Exception
    {
        /// <summary>
        /// Initializes the exception with a custom message.
        /// </summary>
        /// <param name="message">The message returned by the exception.</param>
        public ForbiddenAccessException(string message = "You do not have permission to perform this action.")
        : base(message) { }
    }
}

namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// Exception thrown when a material cannot be deleted due to existing dependencies or other causes.
    /// </summary>
    public class MaterialDeletionException : Exception
    {
        /// <summary>
        /// Initializes the exception instance.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        public MaterialDeletionException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

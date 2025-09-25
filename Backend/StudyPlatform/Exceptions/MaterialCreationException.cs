namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// Exception thrown when there is an error during the creation of study material.
    /// </summary>
    public class MaterialCreationException : Exception
    {
        /// <summary>
        /// Initializes the exception instance.
        /// </summary>
        /// <param name="message">The text message of the exception.</param>
        /// <param name="inner">The inner exception.</param>
        public MaterialCreationException(string message, Exception inner = null)
            : base(message, inner)
        {
        }
    }

}

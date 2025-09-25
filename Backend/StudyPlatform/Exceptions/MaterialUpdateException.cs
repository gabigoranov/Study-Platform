namespace StudyPlatform.Exceptions
{
    /// <summary>
    /// Exception thrown when there is an error during the update of study material.
    /// </summary>
    public class MaterialUpdateException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MaterialUpdateException"/> class.
        /// </summary>
        /// <param name="message">The texte message.</param>
        /// <param name="innerException">The inner exception instance.</param>
        public MaterialUpdateException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}

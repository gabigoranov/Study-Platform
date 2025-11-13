namespace StudyPlatform.Data.Common
{
    /// <summary>
    /// A static class used to abstract the commonly used constants, such as the base URL for microservices.
    /// </summary>
    public static class AppConstants
    {
        /// <summary>
        /// Base url for flashcards microservice.
        /// </summary>
        public const string FLASHCARDS_MICROSERVICE_BASE_URL = "http://localhost:8000/flashcards";
        public const string MINDMAPS_MICROSERVICE_BASE_URL = "http://localhost:8001/mindmaps";
        public const string QUIZZES_MICROSERVICE_BASE_URL = "http://localhost:8002/quizzes";

    }
}

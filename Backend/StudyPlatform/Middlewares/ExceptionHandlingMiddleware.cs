namespace StudyPlatform.Middlewares
{
    using StudyPlatform.Exceptions;
    using System.Net;
    using System.Text.Json;

    /// <summary>
    /// Middleware that handles exceptions globally for the application.
    /// Catches unhandled exceptions, maps them to appropriate HTTP status codes,
    /// and returns a JSON error response.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// Initializes a new instance of the <see cref="ExceptionHandlingMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next middleware component in the pipeline.</param>
        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Invokes the middleware logic. Wraps the request delegate in a try-catch block
        /// to capture and process unhandled exceptions.
        /// </summary>
        /// <param name="context">The current <see cref="HttpContext"/>.</param>
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context); // continue down pipeline
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Maps exceptions to HTTP status codes and writes a JSON error response.
        /// </summary>
        /// <param name="context">The current <see cref="HttpContext"/>.</param>
        /// <param name="ex">The exception that was thrown.</param>
        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var statusCode = HttpStatusCode.InternalServerError;

            // Example: map specific exception types
            if (ex is ArgumentException) statusCode = HttpStatusCode.BadRequest;
            if (ex is UnauthorizedAccessException) statusCode = HttpStatusCode.Unauthorized;
            if (ex is ForbiddenAccessException) statusCode = HttpStatusCode.Forbidden;

            var result = JsonSerializer.Serialize(new
            {
                error = ex.Message,
                statusCode = (int)statusCode
            });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(result);
        }
    }

}

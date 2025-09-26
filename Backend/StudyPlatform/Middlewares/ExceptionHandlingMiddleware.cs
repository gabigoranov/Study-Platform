namespace StudyPlatform.Middlewares
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Hosting;
    using StudyPlatform.Exceptions;
    using System.Net;
    using System.Text.Json;

    /// <summary>
    /// Middleware for global exception handling in the application.
    /// Converts unhandled exceptions into consistent JSON error responses
    /// based on <see cref="ProblemDetails"/> (RFC 7807).
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        /// <summary>
        /// Initializes a new instance of the <see cref="ExceptionHandlingMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next middleware component in the pipeline.</param>
        /// <param name="logger">The logger used to log exception details.</param>
        /// <param name="environment">The hosting environment (used to show detailed errors in Development).</param>
        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
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
                _logger.LogError(ex, "Unhandled exception occurred while processing request {Path}", context.Request.Path);
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Maps exceptions to HTTP status codes and writes a standardized JSON error response.
        /// </summary>
        /// <param name="context">The current <see cref="HttpContext"/>.</param>
        /// <param name="ex">The exception that was thrown.</param>
        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Default values
            var statusCode = HttpStatusCode.InternalServerError;
            var title = "An unexpected error occurred";

            // Map exception types to HTTP status codes
            switch (ex)
            {
                // 400 Bad Request
                case ArgumentException:
                case FormatException:
                case InvalidCastException:
                case OverflowException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Invalid request";
                    break;

                // 401 Unauthorized
                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    title = "Unauthorized";
                    break;

                // 403 Forbidden
                case ForbiddenAccessException:
                    statusCode = HttpStatusCode.Forbidden;
                    title = "Forbidden";
                    break;

                // 404 Not Found
                case KeyNotFoundException:
                case FileNotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    title = "Resource not found";
                    break;

                // 405 Method Not Allowed
                case NotSupportedException:
                    statusCode = HttpStatusCode.MethodNotAllowed;
                    title = "Method not allowed";
                    break;

                // 409 Conflict
                case InvalidOperationException:
                    statusCode = HttpStatusCode.Conflict;
                    title = "Conflict";
                    break;

                // 415 Unsupported Media Type
                case NotImplementedException:
                    statusCode = HttpStatusCode.UnsupportedMediaType;
                    title = "Unsupported operation";
                    break;

                // 422 Unprocessable Entity
                case ApplicationException:
                    statusCode = HttpStatusCode.UnprocessableEntity;
                    title = "Unprocessable entity";
                    break;

                // 400: Material creation error
                case MaterialCreationException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Material creation error";
                    break;

                // 400: Material update error
                case MaterialUpdateException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Material update error";
                    break;

                // 400: Material fetching error
                case MaterialFetchingException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Material fetching error";
                    break;

                // 400: Material deletion error
                case MaterialDeletionException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Material deletion error";
                    break;

                // 400: MaterialSubGroup fetching error
                case SubGroupFetchingException:
                    statusCode = HttpStatusCode.BadRequest;
                    title = "Material group fetching error";
                    break;

                // 500: DB update error
                case DbUpdateException:
                    statusCode = HttpStatusCode.InternalServerError;
                    title = "Database update error";
                    break;

                // 500 Internal Server Error (fallback)
                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    title = "Internal server error";
                    break;
            }

            // Hide sensitive messages in production
            var detail = _environment.IsDevelopment()
                ? ex.Message
                : "An error occurred while processing your request. Please contact support.";

            // Build RFC 7807 ProblemDetails response
            var problemDetails = new ProblemDetails
            {
                Status = (int)statusCode,
                Title = title,
                Detail = detail,
                Instance = context.Request.Path
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, options));
        }
    }
}

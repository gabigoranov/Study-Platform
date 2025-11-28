namespace StudyPlatform.Middlewares
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Hosting;
    using StudyPlatform.Exceptions;
    using System.Net;
    using System.Text.Json;

    /// <summary>
    /// Middleware for global exception handling.
    /// Converts unhandled exceptions into consistent JSON error responses.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        private static readonly Dictionary<Type, (HttpStatusCode StatusCode, string Title)> ExceptionMappings =
            new()
            {
                { typeof(ArgumentException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(ArgumentNullException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(ArgumentOutOfRangeException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(FormatException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(InvalidCastException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(OverflowException), (HttpStatusCode.BadRequest, "Invalid request") },
                { typeof(UnauthorizedAccessException), (HttpStatusCode.Unauthorized, "Unauthorized") },
                { typeof(ForbiddenAccessException), (HttpStatusCode.Forbidden, "Forbidden") },
                { typeof(KeyNotFoundException), (HttpStatusCode.NotFound, "Resource not found") },
                { typeof(FileNotFoundException), (HttpStatusCode.NotFound, "Resource not found") },
                { typeof(NotSupportedException), (HttpStatusCode.MethodNotAllowed, "Method not allowed") },
                { typeof(InvalidOperationException), (HttpStatusCode.Conflict, "Conflict") },
                { typeof(FriendRequestException), (HttpStatusCode.Conflict, "Conflict") },
                { typeof(NotImplementedException), (HttpStatusCode.UnsupportedMediaType, "Unsupported operation") },
                { typeof(ApplicationException), (HttpStatusCode.UnprocessableEntity, "Unprocessable entity") },
                { typeof(MaterialCreationException), (HttpStatusCode.BadRequest, "Material creation error") },
                { typeof(MaterialUpdateException), (HttpStatusCode.BadRequest, "Material update error") },
                { typeof(MaterialFetchingException), (HttpStatusCode.BadRequest, "Material fetching error") },
                { typeof(MaterialDeletionException), (HttpStatusCode.BadRequest, "Material deletion error") },
                { typeof(SubGroupFetchingException), (HttpStatusCode.BadRequest, "Material group fetching error") },
                { typeof(SubjectFetchingException), (HttpStatusCode.BadRequest, "Subject fetching error") },
                { typeof(SubjectCreationException), (HttpStatusCode.BadRequest, "Subject creation error") },
                { typeof(DbUpdateException), (HttpStatusCode.InternalServerError, "Database update error") },
            };

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger,
            IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log unexpected errors only
                _logger.LogError(ex, "Unhandled exception occurred while processing request {Path}", context.Request.Path);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Map exception to status code and title, fallback to 500
            var (statusCode, title) = ExceptionMappings.TryGetValue(ex.GetType(), out var mapping)
                ? mapping
                : (HttpStatusCode.InternalServerError, "Internal server error");

            // Include inner exception details in development
            var detail = _environment.IsDevelopment()
                ? $"{ex.Message}{(ex.InnerException != null ? $" | Inner: {ex.InnerException.Message}" : "")}"
                : "An error occurred while processing your request. Please contact support.";

            var problemDetails = new ProblemDetails
            {
                Status = (int)statusCode,
                Title = title,
                Detail = detail,
                Instance = context.Request.Path
            };

            // Optional: add traceId for easier log correlation
            problemDetails.Extensions["traceId"] = context.TraceIdentifier;

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, options));
        }
    }
}

using System.Security.Claims;

namespace StudyPlatform.Extensions
{
    /// <summary>
    /// An extension class for the claims prinicpal.
    /// </summary>
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// An extension for extracting the userId out of the JWT token.
        /// </summary>
        /// <param name="user">The claims principal.</param>
        /// <returns>The user id if successful.</returns>
        /// <exception cref="UnauthorizedAccessException">Returned if the user id claim is missing or invalid.</exception>
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst("sub")?.Value
                      ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
                throw new UnauthorizedAccessException("User ID claim is missing.");

            if (!Guid.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("User ID claim is not a valid GUID.");

            return userId;
        }
    }
}

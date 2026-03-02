using System.Security.Claims;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Data.Types;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Exceptions;

namespace StudyPlatform.Extensions
{
    /// <summary>
    /// Extension methods for admin authorization checks.
    /// </summary>
    public static class AdminAuthorizationExtensions
    {
        /// <summary>
        /// Checks if the current user is an admin.
        /// </summary>
        /// <param name="repo">The repository instance.</param>
        /// <param name="userId">The user ID to check.</param>
        /// <returns>True if the user is an admin.</returns>
        /// <exception cref="ForbiddenAccessException">Thrown when the user is not an admin.</exception>
        public static async Task<bool> IsAdminAsync(this IRepository repo, Guid userId)
        {
            var user = await repo.AllReadonly<AppUser>()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Discriminator != AppUserType.Admin)
            {
                throw new ForbiddenAccessException("Only administrators can perform this action.");
            }

            return true;
        }
    }
}

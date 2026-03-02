using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Organizations
{
    /// <summary>
    /// Service interface for managing organizations.
    /// </summary>
    public interface IOrganizationsService
    {
        /// <summary>
        /// Gets all organizations.
        /// </summary>
        /// <param name="includeGroups">Whether to include organization groups.</param>
        /// <returns>A collection of organizations.</returns>
        Task<IEnumerable<OrganizationDTO>> GetAllAsync(bool includeGroups = false);

        /// <summary>
        /// Gets a single organization by ID.
        /// </summary>
        /// <param name="id">The organization ID.</param>
        /// <param name="includeGroups">Whether to include organization groups.</param>
        /// <returns>The organization if found.</returns>
        Task<OrganizationDTO> GetByIdAsync(int id, bool includeGroups = false);

        /// <summary>
        /// Creates a new organization.
        /// </summary>
        /// <param name="model">The organization creation model.</param>
        /// <param name="adminUserId">The ID of the admin user creating the organization.</param>
        /// <returns>The created organization.</returns>
        Task<OrganizationDTO> CreateAsync(CreateOrganizationViewModel model, Guid adminUserId);

        /// <summary>
        /// Updates an existing organization.
        /// </summary>
        /// <param name="model">The organization update model.</param>
        /// <param name="id">The organization ID.</param>
        /// <returns>The updated organization.</returns>
        Task<OrganizationDTO> UpdateAsync(UpdateOrganizationViewModel model, int id);

        /// <summary>
        /// Deletes an organization by ID.
        /// </summary>
        /// <param name="id">The organization ID.</param>
        Task DeleteAsync(int id);
    }
}

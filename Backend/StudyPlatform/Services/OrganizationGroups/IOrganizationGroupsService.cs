using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.OrganizationGroups
{
    /// <summary>
    /// Service interface for managing organization groups.
    /// </summary>
    public interface IOrganizationGroupsService
    {
        /// <summary>
        /// Gets all organization groups for a specific organization.
        /// </summary>
        /// <param name="organizationId">The organization ID.</param>
        /// <param name="includeUsers">Whether to include users count.</param>
        /// <returns>A collection of organization groups.</returns>
        Task<IEnumerable<OrganizationGroupDTO>> GetByOrganizationAsync(int organizationId, bool includeUsers = false);

        /// <summary>
        /// Gets a single organization group by ID.
        /// </summary>
        /// <param name="id">The organization group ID.</param>
        /// <returns>The organization group if found.</returns>
        Task<OrganizationGroupDTO> GetByIdAsync(int id);

        /// <summary>
        /// Creates a new organization group.
        /// </summary>
        /// <param name="model">The organization group creation model.</param>
        /// <returns>The created organization group.</returns>
        Task<OrganizationGroupDTO> CreateAsync(CreateOrganizationGroupViewModel model);

        /// <summary>
        /// Updates an existing organization group.
        /// </summary>
        /// <param name="model">The organization group update model.</param>
        /// <param name="id">The organization group ID.</param>
        /// <returns>The updated organization group.</returns>
        Task<OrganizationGroupDTO> UpdateAsync(UpdateOrganizationGroupViewModel model, int id);

        /// <summary>
        /// Deletes an organization group by ID.
        /// </summary>
        /// <param name="id">The organization group ID.</param>
        Task DeleteAsync(int id);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.OrganizationGroups;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages organization groups.
    /// </summary>
    /// <remarks>
    /// All endpoints in this controller require authentication and admin role.
    /// The user ID is extracted from the JWT token.
    /// Validation errors are automatically handled by global middleware.
    /// Unhandled exceptions return a standardized error response.
    /// </remarks>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationGroupsController : ControllerBase
    {
        private readonly IOrganizationGroupsService _organizationGroupsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="organizationGroupsService">The organization groups service, dependency injected.</param>
        public OrganizationGroupsController(IOrganizationGroupsService organizationGroupsService)
        {
            _organizationGroupsService = organizationGroupsService;
        }

        /// <summary>
        /// Gets all organization groups for a specific organization.
        /// </summary>
        /// <param name="organizationId">The organization ID.</param>
        /// <param name="includeUsers">Whether to include users count.</param>
        /// <returns>A collection of organization groups.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrganizationGroupDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrganizationGroups([FromQuery] int organizationId, [FromQuery] bool includeUsers = false)
        {
            var groups = await _organizationGroupsService.GetByOrganizationAsync(organizationId, includeUsers);
            return Ok(groups);
        }

        /// <summary>
        /// Gets a single organization group by ID.
        /// </summary>
        /// <param name="id">The organization group ID.</param>
        /// <returns>The organization group if found.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrganizationGroupDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrganizationGroup(int id)
        {
            var group = await _organizationGroupsService.GetByIdAsync(id);
            return Ok(group);
        }

        /// <summary>
        /// Creates a new organization group.
        /// </summary>
        /// <remarks>
        /// The calling user must be an admin. The admin user ID is extracted from the JWT token.
        /// </remarks>
        /// <param name="model">The organization group creation model.</param>
        /// <returns>The created organization group.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(OrganizationGroupDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateOrganizationGroup([FromBody] CreateOrganizationGroupViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            var created = await _organizationGroupsService.CreateAsync(model);
            return CreatedAtAction(nameof(GetOrganizationGroup), new { id = created.Id }, created);
        }

        /// <summary>
        /// Updates an existing organization group.
        /// </summary>
        /// <param name="model">The organization group update model.</param>
        /// <param name="id">The organization group ID.</param>
        /// <returns>The updated organization group.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(OrganizationGroupDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateOrganizationGroup([FromBody] UpdateOrganizationGroupViewModel model, [FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            var updated = await _organizationGroupsService.UpdateAsync(model, id);
            return Ok(updated);
        }

        /// <summary>
        /// Deletes an organization group by ID.
        /// </summary>
        /// <param name="id">The organization group ID.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteOrganizationGroup(int id)
        {
            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            await _organizationGroupsService.DeleteAsync(id);
            return Ok();
        }
    }
}

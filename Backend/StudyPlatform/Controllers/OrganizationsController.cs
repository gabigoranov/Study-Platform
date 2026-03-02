using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Extensions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;
using StudyPlatform.Services.Organizations;

namespace StudyPlatform.Controllers
{
    /// <summary>
    /// Manages organizations.
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
    public class OrganizationsController : ControllerBase
    {
        private readonly IOrganizationsService _organizationsService;

        /// <summary>
        /// Initializes the controller with required services.
        /// </summary>
        /// <param name="organizationsService">The organizations service, dependency injected.</param>
        public OrganizationsController(IOrganizationsService organizationsService)
        {
            _organizationsService = organizationsService;
        }

        /// <summary>
        /// Gets all organizations.
        /// </summary>
        /// <param name="includeGroups">Whether to include organization groups.</param>
        /// <returns>A collection of organizations.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<OrganizationDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrganizations([FromQuery] bool includeGroups = false)
        {
            var organizations = await _organizationsService.GetAllAsync(includeGroups);
            return Ok(organizations);
        }

        /// <summary>
        /// Gets a single organization by ID.
        /// </summary>
        /// <param name="id">The organization ID.</param>
        /// <param name="includeGroups">Whether to include organization groups.</param>
        /// <returns>The organization if found.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrganizationDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrganization(int id, [FromQuery] bool includeGroups = false)
        {
            var organization = await _organizationsService.GetByIdAsync(id, includeGroups);
            return Ok(organization);
        }

        /// <summary>
        /// Creates a new organization.
        /// </summary>
        /// <remarks>
        /// The calling user must be an admin. The admin user ID is extracted from the JWT token.
        /// </remarks>
        /// <param name="model">The organization creation model.</param>
        /// <returns>The created organization.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(OrganizationDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            var created = await _organizationsService.CreateAsync(model, userId);
            return CreatedAtAction(nameof(GetOrganization), new { id = created.Id }, created);
        }

        /// <summary>
        /// Updates an existing organization.
        /// </summary>
        /// <param name="model">The organization update model.</param>
        /// <param name="id">The organization ID.</param>
        /// <returns>The updated organization.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(OrganizationDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateOrganization([FromBody] UpdateOrganizationViewModel model, [FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            var updated = await _organizationsService.UpdateAsync(model, id);
            return Ok(updated);
        }

        /// <summary>
        /// Deletes an organization by ID.
        /// </summary>
        /// <param name="id">The organization ID.</param>
        /// <returns>Nothing.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteOrganization(int id)
        {
            Guid userId = User.GetUserId();

            // Verify user is an admin
            await HttpContext.RequestServices.GetRequiredService<Data.Common.IRepository>()
                .IsAdminAsync(userId);

            await _organizationsService.DeleteAsync(id);
            return Ok();
        }
    }
}

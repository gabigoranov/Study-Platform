using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Data.Types;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.Organizations
{
    /// <summary>
    /// Service for managing organizations.
    /// </summary>
    public class OrganizationsService : IOrganizationsService
    {
        private readonly IRepository _repo;
        private readonly ILogger<OrganizationsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="OrganizationsService"/> class.
        /// </summary>
        public OrganizationsService(IRepository repo, ILogger<OrganizationsService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<OrganizationDTO>> GetAllAsync(bool includeGroups = false)
        {
            IQueryable<Organization> query = _repo.AllReadonly<Organization>();

            if (includeGroups)
                query = query.Include(o => o.OrganizationGroups);

            var entities = await query.ToListAsync();

            if (entities == null || !entities.Any())
                _logger.LogWarning("No organizations found");

            return _mapper.Map<IEnumerable<OrganizationDTO>>(entities);
        }

        /// <inheritdoc />
        public async Task<OrganizationDTO> GetByIdAsync(int id, bool includeGroups = false)
        {
            if (id <= 0) throw new ArgumentException("Organization ID must be greater than zero.");

            IQueryable<Organization> query = _repo.AllReadonly<Organization>();

            if (includeGroups)
                query = query.Include(o => o.OrganizationGroups);

            var entity = await query.FirstOrDefaultAsync(o => o.Id == id);

            if (entity == null)
            {
                _logger.LogWarning("Organization {OrganizationId} not found", id);
                throw new KeyNotFoundException("Could not find the specified organization");
            }

            return _mapper.Map<OrganizationDTO>(entity);
        }

        /// <inheritdoc />
        public async Task<OrganizationDTO> CreateAsync(CreateOrganizationViewModel model, Guid adminUserId)
        {
            if (model == null) throw new ArgumentException("CreateOrganization model can not be null or empty.");
            if (adminUserId == Guid.Empty) throw new ArgumentException("Admin user ID must be provided.");

            // Verify the admin user exists
            var adminUser = await _repo.AllReadonly<AppUser>()
                .FirstOrDefaultAsync(u => u.Id == adminUserId && u.Discriminator == AppUserType.Admin);

            if (adminUser == null)
            {
                _logger.LogWarning("Admin user {AdminUserId} not found", adminUserId);
                throw new KeyNotFoundException("The specified admin user does not exist or is not an admin.");
            }

            // Create the organization
            var organization = _mapper.Map<Organization>(model);

            await _repo.AddAsync<Organization>(organization);
            await _repo.SaveChangesAsync();

            // Link the admin to the organization by setting their OrganizationGroupId
            // Note: Admin users are typically not assigned to a specific group, 
            // but we can track their association if needed

            _logger.LogInformation("Created organization {OrganizationId} with admin user {AdminId}", organization.Id, adminUserId);

            return _mapper.Map<OrganizationDTO>(organization);
        }

        /// <inheritdoc />
        public async Task<OrganizationDTO> UpdateAsync(UpdateOrganizationViewModel model, int id)
        {
            if (model == null) throw new ArgumentNullException("The organization model can not be null or empty.");
            if (id <= 0) throw new ArgumentException("Id must be greater than zero.");

            var organization = await _repo.All<Organization>().FirstOrDefaultAsync(o => o.Id == id);

            if (organization == null)
            {
                _logger.LogWarning("Organization {OrganizationId} not found", id);
                throw new KeyNotFoundException("Could not find the requested organization.");
            }

            _mapper.Map(model, organization);

            await _repo.SaveChangesAsync();

            return _mapper.Map<OrganizationDTO>(organization);
        }

        /// <inheritdoc />
        public async Task DeleteAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Organization ID must be greater than zero.");

            await _repo.ExecuteDeleteAsync<Organization>(o => o.Id == id);
        }
    }
}

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyPlatform.Data.Common;
using StudyPlatform.Data.Models;
using StudyPlatform.Exceptions;
using StudyPlatform.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Services.OrganizationGroups
{
    /// <summary>
    /// Service for managing organization groups.
    /// </summary>
    public class OrganizationGroupsService : IOrganizationGroupsService
    {
        private readonly IRepository _repo;
        private readonly ILogger<OrganizationGroupsService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="OrganizationGroupsService"/> class.
        /// </summary>
        public OrganizationGroupsService(IRepository repo, ILogger<OrganizationGroupsService> logger, IMapper mapper)
        {
            _repo = repo;
            _logger = logger;
            _mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<OrganizationGroupDTO>> GetByOrganizationAsync(int organizationId, bool includeUsers = false)
        {
            if (organizationId <= 0) throw new ArgumentException("Organization ID must be greater than zero.");

            IQueryable<OrganizationGroup> query = _repo.AllReadonly<OrganizationGroup>()
                .Where(g => g.OrganizationId == organizationId);

            if (includeUsers)
                query = query.Include(g => g.AppUsers);

            var entities = await query.ToListAsync();

            if (entities == null || !entities.Any())
                _logger.LogWarning("No organization groups found for organization {OrganizationId}", organizationId);

            return _mapper.Map<IEnumerable<OrganizationGroupDTO>>(entities);
        }

        /// <inheritdoc />
        public async Task<OrganizationGroupDTO> GetByIdAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Organization group ID must be greater than zero.");

            var entity = await _repo.AllReadonly<OrganizationGroup>()
                .FirstOrDefaultAsync(g => g.Id == id);

            if (entity == null)
            {
                _logger.LogWarning("Organization group {OrganizationGroupId} not found", id);
                throw new KeyNotFoundException("Could not find the specified organization group");
            }

            return _mapper.Map<OrganizationGroupDTO>(entity);
        }

        /// <inheritdoc />
        public async Task<OrganizationGroupDTO> CreateAsync(CreateOrganizationGroupViewModel model)
        {
            if (model == null) throw new ArgumentException("CreateOrganizationGroup model can not be null or empty.");
            if (model.OrganizationId <= 0) throw new ArgumentException("Organization ID must be greater than zero.");

            // Verify the organization exists
            var organization = await _repo.AllReadonly<Organization>()
                .FirstOrDefaultAsync(o => o.Id == model.OrganizationId);

            if (organization == null)
            {
                _logger.LogWarning("Organization {OrganizationId} not found for group creation", model.OrganizationId);
                throw new KeyNotFoundException("The specified organization does not exist.");
            }

            var organizationGroup = _mapper.Map<OrganizationGroup>(model);

            await _repo.AddAsync<OrganizationGroup>(organizationGroup);
            await _repo.SaveChangesAsync();

            _logger.LogInformation("Created organization group {OrganizationGroupId} for organization {OrganizationId}", organizationGroup.Id, organizationGroup.OrganizationId);

            return _mapper.Map<OrganizationGroupDTO>(organizationGroup);
        }

        /// <inheritdoc />
        public async Task<OrganizationGroupDTO> UpdateAsync(UpdateOrganizationGroupViewModel model, int id)
        {
            if (model == null) throw new ArgumentNullException("The organization group model can not be null or empty.");
            if (id <= 0) throw new ArgumentException("Id must be greater than zero.");
            if (model.OrganizationId <= 0) throw new ArgumentException("Organization ID must be greater than zero.");

            var organizationGroup = await _repo.All<OrganizationGroup>()
                .Include(g => g.Organization)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (organizationGroup == null)
            {
                _logger.LogWarning("Organization group {OrganizationGroupId} not found", id);
                throw new KeyNotFoundException("Could not find the requested organization group.");
            }

            // Verify the new organization exists if it's different
            if (organizationGroup.OrganizationId != model.OrganizationId)
            {
                var organization = await _repo.AllReadonly<Organization>()
                    .FirstOrDefaultAsync(o => o.Id == model.OrganizationId);

                if (organization == null)
                {
                    _logger.LogWarning("Target organization {OrganizationId} not found for group update", model.OrganizationId);
                    throw new KeyNotFoundException("The specified organization does not exist.");
                }
            }

            _mapper.Map(model, organizationGroup);

            await _repo.SaveChangesAsync();

            return _mapper.Map<OrganizationGroupDTO>(organizationGroup);
        }

        /// <inheritdoc />
        public async Task DeleteAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Organization group ID must be greater than zero.");

            await _repo.ExecuteDeleteAsync<OrganizationGroup>(g => g.Id == id);
        }
    }
}

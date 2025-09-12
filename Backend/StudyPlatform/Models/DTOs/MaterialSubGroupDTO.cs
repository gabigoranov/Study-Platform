using StudyPlatform.Data.Types;

namespace StudyPlatform.Models.DTOs
{
    /// <summary>
    /// Data transfer object returned when working with material subgroups.
    /// </summary>
    public class MaterialSubGroupDTO
    {
        /// <summary>
        /// The unique identifier of the material subgroup.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The title of the subgroup.
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The type of material group this subgroup belongs to.
        /// </summary>
        public MaterialGroupType MaterialGroupType { get; set; }

        /// <summary>
        /// The ID of the subject this subgroup belongs to.
        /// </summary>
        public int SubjectId { get; set; }

        /// <summary>
        /// The UTC date when this subgroup was created.
        /// </summary>
        public DateTimeOffset DateCreated { get; set; }

        /// <summary>
        /// List of materials in the sub group, optional.
        /// </summary>
        public ICollection<MaterialDTO> Materials { get; set; } = new List<MaterialDTO>();
    }
}

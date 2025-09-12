using AutoMapper;
using StudyPlatform.Data.Models;
using StudyPlatform.Models.DTOs;

namespace StudyPlatform.Models.Common
{
    /// <summary>
    /// Defines the AutoMapper initialization and maps.
    /// </summary>
    public class AutoMapper : Profile
    {
        public AutoMapper() {
            // Include sub categories so AutoMapper maps their unique values.
            CreateMap<Material, MaterialDTO>()
                .Include<Flashcard, FlashcardDTO>();

            //Flashcard mappings
            CreateMap<CreateFlashcardViewModel, Flashcard>().ReverseMap();
            CreateMap<Flashcard, FlashcardDTO>().ReverseMap();

            // Subject mappings
            CreateMap<Subject, SubjectDto>();
            CreateMap<CreateSubjectViewModel, Subject>();

            // MaterialSubGroup mappings
            CreateMap<MaterialSubGroup, MaterialSubGroupDTO>();
            CreateMap<CreateMaterialSubGroupViewModel, MaterialSubGroup>();

            CreateMap<MaterialSubGroup, MaterialSubGroupDTO>().ReverseMap();
        }
    }
}

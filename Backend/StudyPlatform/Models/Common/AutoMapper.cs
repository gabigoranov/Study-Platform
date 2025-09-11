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
            //Flashcard mappings
            CreateMap<FlashcardViewModel, Flashcard>().ReverseMap();
            CreateMap<Flashcard, FlashcardDTO>().ReverseMap();

            // Subject mappings
            CreateMap<Subject, SubjectDto>();
            CreateMap<CreateSubjectViewModel, Subject>();

            // MaterialSubGroup mappings
            CreateMap<MaterialSubGroup, MaterialSubGroupDto>();
            CreateMap<CreateMaterialSubGroupViewModel, MaterialSubGroup>();
        }
    }
}

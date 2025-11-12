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
            .Include<Flashcard, FlashcardDTO>()
            .Include<Mindmap, MindmapDTO>()
            .Include<Quiz, QuizDTO>()
            .ForMember(dest => dest.SubjectId, opt => opt.MapFrom(x => x.MaterialSubGroup.SubjectId));


            //Flashcard mappings
            CreateMap<CreateFlashcardViewModel, Flashcard>().ReverseMap();
            CreateMap<Flashcard, FlashcardDTO>().ReverseMap();

            // Subject mappings
            CreateMap<Subject, SubjectDTO>()
                .ForMember(dest => dest.MaterialSubGroupsLength, opt => opt.MapFrom(x => x.MaterialSubGroups.Count()));
            CreateMap<CreateSubjectViewModel, Subject>();

            // MaterialSubGroup mappings
            CreateMap<MaterialSubGroup, MaterialSubGroupDTO>();
            CreateMap<CreateMaterialSubGroupViewModel, MaterialSubGroup>();

            CreateMap<MaterialSubGroup, MaterialSubGroupDTO>().ReverseMap();
            CreateMap<Mindmap, CreateMindmapViewModel>().ReverseMap();
            CreateMap<Mindmap, MindmapDTO>().ReverseMap();
            
            // Quiz mappings
            CreateMap<Quiz, QuizDTO>().ReverseMap();
            CreateMap<CreateQuizViewModel, Quiz>();
            CreateMap<QuizQuestion, QuizQuestionDTO>().ReverseMap();
            CreateMap<CreateQuizQuestionViewModel, QuizQuestion>();
            CreateMap<QuizQuestionAnswer, QuizQuestionAnswerDTO>().ReverseMap();
            CreateMap<CreateQuizQuestionAnswerViewModel, QuizQuestionAnswer>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

        }
    }
}

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
            CreateMap<FlashcardViewModel, Flashcard>().ReverseMap();
            CreateMap<Flashcard, FlashcardDTO>().ReverseMap();
        }
    }
}

import { Flashcard } from "@/data/Flashcard";
import { apiService } from "./apiService";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";

export const flashcardService = apiService<Flashcard, FlashcardDTO, FlashcardDTO>("flashcards");
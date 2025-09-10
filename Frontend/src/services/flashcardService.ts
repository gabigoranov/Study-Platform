import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "../data/Flashcard";

export const flashcardService = {
  getAll: async (): Promise<Flashcard[]> => {
    console.log("Fetching all flashcards from API");
    return []; // Placeholder
  },

  getById: async (id: string): Promise<Flashcard> => {
    console.log(`Fetching flashcard with id: ${id}`);
    return { id, front: "", back: "", userId: "" }; // Placeholder
  },

  create: async (flashcard: FlashcardDTO, token: string): Promise<Flashcard> => {
    const response = await fetch("https://localhost:7238/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flashcard),
    });

    return response.json();
  },

  update: async (id: string, flashcard: FlashcardDTO): Promise<void> => {
    console.log(`Updating flashcard ${id}`, flashcard);
  },

  delete: async (id: string): Promise<void> => {
    console.log(`Deleting flashcard ${id}`);
  },
};

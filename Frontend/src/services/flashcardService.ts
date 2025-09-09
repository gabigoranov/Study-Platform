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

  create: async (flashcard: Omit<Flashcard, "id">): Promise<void> => {
    console.log("Creating flashcard", flashcard);
  },

  update: async (id: string, flashcard: Omit<Flashcard, "id">): Promise<void> => {
    console.log(`Updating flashcard ${id}`, flashcard);
  },

  delete: async (id: string): Promise<void> => {
    console.log(`Deleting flashcard ${id}`);
  },
};

import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "../data/Flashcard";
import { BASE_URL } from "@/types/urls";

export const flashcardService = {
  getAll: async (token: string): Promise<Flashcard[]> => {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("API CALL");
    console.log(data);

    return data;
  },

  getById: async (id: string, token: string): Promise<Flashcard> => {
    const response = await fetch(`${BASE_URL}/flashcards/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    return response.json();
  },

  create: async (flashcard: FlashcardDTO, token: string): Promise<Flashcard> => {
    const response = await fetch(`${BASE_URL}/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flashcard),
    });

    return response.json();
  },

  update: async (id: string, flashcard: FlashcardDTO, token: string): Promise<Flashcard> => {
    const response = await fetch(`${BASE_URL}/flashcards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flashcard),
    });

    return response.json();
  },

  delete: async (id: string, token: string): Promise<void> => {
    await fetch(`${BASE_URL}/flashcards?ids=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
  },
};

import React from "react";
import { Flashcard } from "../data/Flashcard";
import FlashcardDashboardComponent from "./Flashcards/FlashcardDashboardComponent";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards, onEdit, onDelete }) => {
  if (flashcards.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="p-8 text-center text-gray-500">No flashcards to display.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto flex gap-2 p-4 ">
      {flashcards.map(( element, idx ) => (
        <FlashcardDashboardComponent key={idx} flashcard={element} />
      ))}
    </div>
  );
};

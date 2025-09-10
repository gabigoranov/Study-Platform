import React from "react";
import { Flashcard } from "../../data/Flashcard";
import FlashcardDashboardComponent from "./FlashcardDashboardComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";

interface FlashcardsDashboardListProps {
  flashcards: Flashcard[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FlashcardsDashboardList({ flashcards, onEdit, onDelete } : FlashcardsDashboardListProps) {
  const { t } = useTranslation();
  if (flashcards.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="p-8 text-center text-gray-500">{t(keys.noFlashcards)}</p>
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

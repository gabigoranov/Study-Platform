import React, { useState } from "react";
import { Flashcard } from "../../data/Flashcard";
import FlashcardDashboardComponent from "./FlashcardDashboardComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";

interface FlashcardsDashboardListProps {
  flashcards: Flashcard[];
  onSelect: (id: number) => void;
  selectedId: number | null;
}

export default function FlashcardsDashboardList({ flashcards, onSelect, selectedId } : FlashcardsDashboardListProps) {
  const { t } = useTranslation();

  if (flashcards.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="p-8 text-center text-gray-500">{t(keys.noFlashcards)}</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-wrap gap-3 py-4 self-start ">
      {flashcards.map(( element, idx ) => (
        <FlashcardDashboardComponent onSelect={onSelect} key={idx} flashcard={element} isSelected={selectedId === element.id} />
      ))}
    </div>
  );
};

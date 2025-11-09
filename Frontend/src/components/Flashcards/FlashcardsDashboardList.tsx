import React, { useState } from "react";
import { Flashcard } from "../../data/Flashcard";
import FlashcardDashboardComponent from "./FlashcardDashboardComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import ViewFlashcardComponent from "./ViewFlashcardComponent";
import ViewFlashcardSkeleton from "./ViewFlashcardSkeleton";

interface FlashcardsDashboardListProps {
  flashcards: Flashcard[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  loading?: boolean;
}

export default function FlashcardsDashboardList({
  flashcards,
  onSelect,
  selectedId,
  loading = false,
}: FlashcardsDashboardListProps) {
  const { t } = useTranslation();

  function renderSkeletons(count: number) {
    return Array.from({ length: count }, (_, i) => (
      <ViewFlashcardSkeleton key={i} />
    ));
  }

  // Render skeleton components while loading
  if (loading) {
    return (
      <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-center overflow-x-hidden">
        {renderSkeletons(9)}
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="p-8 text-center text-gray-500">{t(keys.noFlashcards)}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-center overflow-x-hidden">
      {flashcards.map((element, idx) => (
        <FlashcardDashboardComponent
          onSelect={onSelect}
          key={idx}
          flashcard={element}
          isSelected={selectedId === element.id}
        />
      ))}
    </div>
  );
}

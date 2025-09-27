import FlashcardDashboardComponent from "@/components/Flashcards/FlashcardDashboardComponent";
import ViewFlashcardComponent from "@/components/Flashcards/ViewFlashcardComponent";
import { Flashcard } from "@/data/Flashcard";
import { keys } from "@/types/keys";
import { t } from "i18next";
import { useState } from "react";

type FlashcardsRevisionProps = {
  flashcards: Flashcard[] | undefined;
};

export default function FlashcardsRevision({
  flashcards,
}: FlashcardsRevisionProps) {
  if (flashcards === undefined || flashcards.length <= 0) {
    return <p className="text-center">{t(keys.noRevisionAvailableLabel)}</p>;
  }

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState<Flashcard>(
    flashcards[currentCardIndex]
  );

  function calculateNextCardIndex(currentIndex: number, cardsLength: number) {
    if (currentIndex + 1 < cardsLength) return currentIndex + 1;

    return currentIndex;
  }

  function handleNextCard(difficulty: string) {
    setCurrentCardIndex(
      calculateNextCardIndex(currentCardIndex, flashcards!.length)
    );
    setCurrentCard(flashcards![currentCardIndex]);
  }

  return (
    <div className="relative flex flex-row gap-4 w-full h-full justify-center items-center overflow-hidden">
      <div className="absolute top-0 left-0 h-4 bg-surface w-fit p-4 rounded-full flex items-center">
        {currentCardIndex + 1} / {flashcards.length}
      </div>

      <div className="relative flex flex-col sm:flex-row gap-4 sm:min-w-[60%] h-fit justify-between">
        <div className="relative w-full flex max-w-[100%]">
          <ViewFlashcardComponent flashcard={currentCard} />
        </div>
        <div className="flex sm:flex-col sm:gap-2 self-center flex-wrap">
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out whitespace-nowrap"
            onClick={() => handleNextCard("very-hard")}
          >
            Very Hard
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard("hard")}
          >
            Hard
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard("normal")}
          >
            Normal
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard("easy")}
          >
            Easy
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard("very-easy")}
          >
            Very Easy
          </button>
        </div>
      </div>
    </div>
  );
}

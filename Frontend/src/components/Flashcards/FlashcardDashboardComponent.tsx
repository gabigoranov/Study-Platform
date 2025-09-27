import { useState } from "react";
import { Flashcard } from "../../data/Flashcard";
import DifficultyTag from "../Common/DifficultyTag";
import { keys } from "@/types/keys";
import { t } from "i18next";

type FlashcardDashboardProps = {
  flashcard: Flashcard;
  onSelect: (id: number) => void;
  isSelected: boolean;
};

export default function FlashcardDashboardComponent({
  flashcard,
  isSelected,
  onSelect,
}: FlashcardDashboardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
    onSelect(flashcard.id);
  };

  return (
    <div
      className={`relative min-w-[50vw] sm:min-w-[400px] sm:max-w-[33.33%] min-h-[400px] cursor-pointer [perspective:1000px] basis-[400px] flex-1`}
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateX(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div
          className={`absolute w-full h-full rounded-3xl bg-neutral-100 p-4 border border-neutral-300 dark:bg-background-dark dark:border-neutral-800 [backface-visibility:hidden] ${
            isSelected ? "ring-2 ring-primary-dark" : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-4">{flashcard.title}</h2>
          <p className="text-lg">{flashcard.front}</p>
          <DifficultyTag
            difficulty={flashcard.difficulty}
            className="absolute bottom-3 right-3"
          />
        </div>

        {/* Back */}
        <div
          className={`absolute w-full h-full rounded-3xl bg-neutral-100 p-4 border border-neutral-300 dark:bg-background-dark dark:border-neutral-800 [backface-visibility:hidden] [transform:rotateX(180deg)] ${
            isSelected ? "ring-2 ring-primary-dark" : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-4">{t(keys.answerTextLabel)}</h2>
          <p className="text-lg">{flashcard.back}</p>
          <DifficultyTag
            difficulty={flashcard.difficulty}
            className="absolute bottom-3 right-3"
          />
        </div>
      </div>
    </div>
  );
}

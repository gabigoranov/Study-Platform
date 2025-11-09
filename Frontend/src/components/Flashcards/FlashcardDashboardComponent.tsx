import { useState } from "react";
import { Flashcard } from "../../data/Flashcard";
import DifficultyTag from "../Common/DifficultyTag";
import { keys } from "@/types/keys";
import { t } from "i18next";
import { motion } from "motion/react";

type FlashcardDashboardProps = {
  flashcard: Flashcard;
  onSelect: (id: string) => void;
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
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Front */}
        <div
          className={`absolute w-full h-full rounded-3xl bg-surface p-4 border border-border [backface-visibility:hidden] ${
            isSelected ? "ring-1 ring-primary-light" : ""
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
          className={`absolute w-full h-full rounded-3xl bg-background-muted p-4 border border-border [backface-visibility:hidden] [transform:rotateX(180deg)] ${
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
      </motion.div>
    </div>
  );
}

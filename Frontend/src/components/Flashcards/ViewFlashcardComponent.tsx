import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import DifficultyTag from "../Common/DifficultyTag";
import { keys } from "@/types/keys";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type ViewFlashcardProps = {
  flashcard?: FlashcardDTO | undefined;
  onEdit?: (flashcard: FlashcardDTO) => void;
  onDelete?: (flashcard: FlashcardDTO) => void;
  isFlipped?: boolean;
  onToggleAnswer: () => void;
  disableAnimation?: boolean;
};

export default function ViewFlashcardComponent({
  flashcard,
  onEdit,
  onDelete,
  isFlipped = false,
  onToggleAnswer,
  disableAnimation = false,
}: ViewFlashcardProps) {
  const { t } = useTranslation();
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const handleClick = () => {
    if (isFlipping) return; // ignore clicks while flipping

    onToggleAnswer();
    setIsFlipping(true);

    setTimeout(() => {
      setIsFlipping(false); // re-enable after 500ms
    }, 500);
  };

  if (flashcard == undefined) {
    return <p className="text-center p-4">{t(keys.flashcardNotFound)}</p>;
  }

  return (
    <div
      className="relative min-w-[50vw] sm:min-w-[400px] sm:max-w-[33.33%] min-h-[400px] cursor-pointer [perspective:1000px] basis-[400px] flex-1"
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: disableAnimation ? 0 : 0.5, ease: "easeInOut" }}
      >
        {/* Front */}
        <div className="absolute w-full h-full rounded-3xl bg-surface p-4 border border-border [backface-visibility:hidden]">
          <h2 className="text-xl font-bold mb-4">{flashcard.title}</h2>
          <p className="text-lg">{flashcard.front}</p>

          {/* Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {onEdit && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}

            <DifficultyTag difficulty={flashcard.difficulty} />
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full rounded-3xl bg-background-muted p-4 border border-border [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <h2 className="text-xl font-bold mb-4">{t(keys.answerTextLabel)}</h2>
          <p className="text-lg">{flashcard.back}</p>

          {/* Buttons on back too */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {onEdit && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}

            <DifficultyTag difficulty={flashcard.difficulty} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

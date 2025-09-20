import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { useState } from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";

type ViewFlashcardProps = {
  flashcard: FlashcardDTO;
  onEdit?: (flashcard: FlashcardDTO) => void;
  onDelete?: (flashcard: FlashcardDTO) => void;
};

export default function ViewFlashcardComponent({
  flashcard,
  onEdit,
  onDelete,
}: ViewFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="relative min-w-[50vw] sm:min-w-[400px] sm:max-w-[33.33%] min-h-[400px] cursor-pointer [perspective:1000px] basis-[400px] flex-1"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateX(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full rounded-3xl bg-neutral-100 p-4 border border-neutral-300 dark:bg-background-dark dark:border-neutral-800 [backface-visibility:hidden]">
          <h2 className="text-xl font-bold mb-4">{flashcard.title}</h2>
          <p className="text-lg">{flashcard.front}</p>

          {/* Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {onEdit && (
              <Button
                size="icon"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full rounded-3xl bg-neutral-100 p-4 border border-neutral-300 dark:bg-background-dark dark:border-neutral-800 [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <h2 className="text-xl font-bold mb-4">Answer:</h2>
          <p className="text-lg">{flashcard.back}</p>

          {/* Buttons on back too */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {onEdit && (
              <Button
                size="icon"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(flashcard);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

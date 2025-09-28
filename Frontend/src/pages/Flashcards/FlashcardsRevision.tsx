import FlashcardDashboardComponent from "@/components/Flashcards/FlashcardDashboardComponent";
import ViewFlashcardComponent from "@/components/Flashcards/ViewFlashcardComponent";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/data/Flashcard";
import { RevisionDifficulty } from "@/data/RevisionDifficulty";
import { keys } from "@/types/keys";
import { t } from "i18next";
import { CheckCircle, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type FlashcardsRevisionProps = {
  flashcards: Flashcard[] | undefined;
};

export default function FlashcardsRevision({
  flashcards,
}: FlashcardsRevisionProps) {
  if (flashcards === undefined || flashcards.length <= 0) {
    return <p className="text-center">{t(keys.noRevisionAvailableLabel)}</p>;
  }
  
  function shuffleCards(flashcards: Flashcard[]) {
    return [...flashcards].sort(() => Math.random() - 0.5);
  }
  
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Flashcard[]>(() => shuffleCards(flashcards));

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isAnswerShown, setIsAnswerShown] = useState<boolean>(false);
  const [disableAnimation, setDisableAnimation] = useState<boolean>(false);
  const [isRevisionFinished, setIsRevisionFinished] = useState<boolean>(false);

  const [currentCard, setCurrentCard] = useState<Flashcard>(
    flashcards[currentCardIndex]
  );

  function calculateNextCardIndex(currentIndex: number, cardsLength: number) {
    // In the future this will implement a sophisticated algorithm for showing the right difficulty card based on the user's output.
    // For now just show a certain card from the randomly shuffled cards.

    if (currentIndex + 1 < cardsLength) return currentIndex + 1;

    handleFinishRevision(); //end the revision if this is the last card.
    return currentIndex;
  }

  function handleNextCard(difficulty: RevisionDifficulty) {
    setDisableAnimation(true); // temporarily disable animation
    setIsAnswerShown(false); // instantly reset to front

    // advance card
    setCurrentCardIndex(
      calculateNextCardIndex(currentCardIndex, flashcards!.length)
    );
    setCurrentCard(shuffledFlashcards![currentCardIndex]);

    // re-enable animation for future flips
    setTimeout(() => setDisableAnimation(false), 50);
  }

  function handleFinishRevision() {
    setIsRevisionFinished(true);
  }

  function handleRetry() {
    // reset all props
    setShuffledFlashcards(shuffleCards(flashcards!));
    setCurrentCardIndex(0);
    setCurrentCard(shuffledFlashcards![currentCardIndex]);
    setIsRevisionFinished(false);
  }

  return isRevisionFinished ? (
    <div className="self-center bg-surface p-6 px-10 rounded-xl flex flex-col gap-4">
      <h2 className="text-3xl font-semibold">Congratulations!</h2>
      <p className="text-xl">
        You successfully revised {currentCardIndex+1} flashcards.
      </p>

      <div className="flex gap-4 self-end mt-10">
        <Button variant="ghost" className="text-lg" onClick={handleRetry}>
          <RotateCcw /> Retry
        </Button>

        <Link to="/flashcards">
          <Button variant="outline" className="rounded-xl text-lg">
            Close
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="relative flex flex-row gap-4 w-full h-full justify-center items-center overflow-hidden">
      <div className="absolute top-0 left-0 flex gap-4">
        <div className="h-4 bg-surface w-fit p-4 rounded-full flex items-center">
          {currentCardIndex + 1} / {flashcards.length}
        </div>

        <Button
          variant="ghost"
          className="h-4 w-fit p-4 rounded-full flex items-center"
          onClick={handleFinishRevision}
        >
          <CheckCircle /> Finish
        </Button>
      </div>

      <div className="relative flex flex-col sm:flex-row gap-4 sm:min-w-[60%] h-fit justify-between">
        <div className="relative w-full flex max-w-[100%]">
          <ViewFlashcardComponent
            flashcard={currentCard}
            isFlipped={isAnswerShown}
            onToggleAnswer={() => setIsAnswerShown((prev) => !prev)}
            disableAnimation={disableAnimation}
          />
        </div>
        <div className="flex sm:flex-col sm:gap-2 self-center flex-wrap">
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out whitespace-nowrap"
            onClick={() => handleNextCard(RevisionDifficulty.VeryHard)}
          >
            {t(keys.revisionDifficultyLabelVeryHard)}
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard(RevisionDifficulty.Hard)}
          >
            {t(keys.revisionDifficultyLabelHard)}
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard(RevisionDifficulty.Normal)}
          >
            {t(keys.revisionDifficultyLabelNormal)}
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard(RevisionDifficulty.Easy)}
          >
            {t(keys.revisionDifficultyLabelEasy)}
          </button>
          <button
            className="text-right text-md sm:text-xl p-4 sm:px-8 rounded-xl hover:bg-surface transition-colors duration-300 ease-in-out"
            onClick={() => handleNextCard(RevisionDifficulty.VeryEasy)}
          >
            {t(keys.revisionDifficultyLabelVeryEasy)}
          </button>
        </div>
      </div>
    </div>
  );
}

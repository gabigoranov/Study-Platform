import { Flashcard } from "../../data/Flashcard"

type FlashcardDashboardProps = {
  flashcard: Flashcard
  onSelect: (id: number) => void
  isSelected: boolean
}

export default function FlashcardDashboardComponent({
  flashcard,
  isSelected,
  onSelect,
}: FlashcardDashboardProps) {
  return (
    <div className="flex flex-col gap-3 w-full min-h-[240px]">
      <h3 className="text-lg font-semibold text-left">{flashcard.title}</h3>
      <div
        onClick={() => onSelect(flashcard.id)}
        className={`${
          isSelected
            ? "bg-neutral-300 dark:bg-neutral-400"
            : "bg-background-muted dark:bg-surface"
        } flex gap-4 justify-between items-stretch w-full min-h-[200px] rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800 cursor-pointer`}
      >
        <p className="flex-1 flex items-center justify-center p-6 text-lg sm:text-xl font-medium text-center leading-relaxed bg-background text-text-muted dark:text-text-light break-words">
          {flashcard.front}
        </p>
        <p className="flex-1 flex items-center justify-center p-6 text-lg sm:text-xl font-medium text-center leading-relaxed text-text-muted dark:text-text-light break-words">
          {flashcard.back}
        </p>
      </div>
    </div>
  )
}
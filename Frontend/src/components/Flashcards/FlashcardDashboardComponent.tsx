import { Flashcard } from "../../data/Flashcard"

type FlashcardDashboardProps = {
    flashcard: Flashcard
    onSelect: (id: string) => void
    isSelected: boolean
}

export default function FlashcardDashboardComponent({ flashcard, isSelected, onSelect } : FlashcardDashboardProps) {
    return (
        <div onClick={() => onSelect(flashcard.id)} className={`${isSelected ? "bg-neutral-400" : "bg-background-muted dark:bg-surface"} flex gap-4 justify-between items-center w-auto min-w-[400px] min-h-[200px] rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800`}>
            <p className="w-full h-full flex items-center justify-center text-wrap overflow-ellipsis max-w-[200px] text-xl font-bold text-center text-text-muted dark:text-text-light bg-surface dark:bg-background p-4">
                {flashcard.front}
            </p>
            <p className="w-full text-wrap truncate max-w-[200px] text-xl font-bold text-center text-text-muted dark:text-text-light">
                {flashcard.back}
            </p>
        </div>
    )
}
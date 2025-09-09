import { Flashcard } from "../../data/Flashcard"

type FlashcardDashboardProps = {
    flashcard: Flashcard
}

export default function FlashcardDashboardComponent({ flashcard } : FlashcardDashboardProps) {
    return (
        <div className="flex gap-4 justify-between items-center w-auto min-w-[400px] min-h-[200px] bg-background-muted dark:bg-background-dark dark:ring-1 dark:ring-background p-4 rounded-lg">
            <p className="w-full text-wrap overflow-ellipsis max-w-[200px] text-xl font-bold text-center text-text-muted dark:text-text-light">
                {flashcard.front}
            </p>
            <hr className="w-[2px] h-[100%] rounded-[20px] opacity-5 bg-background-dark dark:bg-background"/>
            <p className="w-full text-wrap truncate max-w-[200px] text-xl font-bold text-center text-text-muted dark:text-text-light">
                {flashcard.back}
            </p>
        </div>
    )
}
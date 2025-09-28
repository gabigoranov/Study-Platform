import { Difficulty } from "@/data/Difficulty";

type DifficultyTagProps = {
    difficulty: Difficulty;
    className?: string;
}

export default function DifficultyTag({ difficulty, className } : DifficultyTagProps) {
    const baseClasses = "inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-full";

    const difficultyClasses =
        difficulty === Difficulty.Easy ? "bg-success text-white" :
        difficulty === Difficulty.Medium ? "bg-warning text-white" :
        "bg-error text-white";

    return (
        <span className={`${baseClasses} ${difficultyClasses} ${className ?? ""}`}>
            {Difficulty[difficulty]}
        </span>
    );
}

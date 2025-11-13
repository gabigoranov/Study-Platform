import { Difficulty } from "../Difficulty"
import { GeneratedQuizQuestionDTO } from "./GeneratedQuizQuestionDTO"

export type GeneratedQuizDTO = {
    title: string,
    description: string,
    questions: GeneratedQuizQuestionDTO[]
    materialSubGroupId?: string | null
    difficulty: Difficulty
}
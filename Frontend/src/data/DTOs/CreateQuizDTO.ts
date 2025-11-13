import { Difficulty } from "../Difficulty"
import { CreateQuizQuestionDTO } from "./CreateQuizQuestionDTO"

export type CreateQuizDTO = {
    title: string,
    description: string,
    materialSubGroupId: string,
    difficulty: Difficulty,
    questions: CreateQuizQuestionDTO[]
}
import { CreateQuizQuestionAnswerDTO } from "./CreateQuizQuestionAnswerDTO"

export type CreateQuizQuestionDTO = {
    description: string,
    answers: CreateQuizQuestionAnswerDTO[]
}
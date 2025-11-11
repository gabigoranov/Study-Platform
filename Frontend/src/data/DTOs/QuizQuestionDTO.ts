import { QuizQuestionAnswer } from "../QuizQuestionAnswer";

export type QuizQuestionDTO = {
  description: string;
  quizId: string;
  correctQuizQuestionAnswerId: string;
  answers: QuizQuestionAnswer[];
}
import { QuizQuestionAnswer } from "../QuizQuestionAnswer";

export type QuizQuestionDTO = {
  description: string;
  quizId: string;
  answers: QuizQuestionAnswer[];
}
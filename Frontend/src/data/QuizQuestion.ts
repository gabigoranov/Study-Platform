import { QuizQuestionAnswer } from "./QuizQuestionAnswer";

export type QuizQuestion = {
  id: string;
  description: string;
  quizId: string;
  correctQuizQuestionAnswerId: string;
  correctQuizQuestionAnswer: QuizQuestionAnswer;
  answers: QuizQuestionAnswer[];
}
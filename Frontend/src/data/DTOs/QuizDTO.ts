import { Difficulty } from "../Difficulty";
import { QuizQuestion } from "../QuizQuestion";

export type QuizDTO = {
  title: string;
  materialSubGroupId: string;
  difficulty: Difficulty;
  description: string;
  questions: QuizQuestion[];
}
import { Difficulty } from "../Difficulty";
import { QuizQuestion } from "../QuizQuestion";

export type QuizDTO = {
  id?: string;
  title: string;
  userId?: string;
  materialSubGroupId: string;
  dateCreated?: Date;
  difficulty: Difficulty;
  description: string;
  questions: QuizQuestion[];
}
import { Material } from "./Material";
import { QuizQuestion } from "./QuizQuestion";

export type Quiz = Material & {
  description: string;
  questions: QuizQuestion[];
}
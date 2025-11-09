import { Difficulty } from "../Difficulty";
import { MaterialDTO } from "./MaterialDTO";

export type FlashcardDTO = {
  front: string;
  back: string;
  title: string;
  materialSubGroupId: string;
  difficulty: Difficulty;
}

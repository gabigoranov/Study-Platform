import { Difficulty } from "../Difficulty";
import { MaterialDTO } from "./MaterialDTO";

export type GeneratedFlashcardDTO = {
  front: string;
  back: string;
  title: string;
  materialSubGroupId?: number | null;
  difficulty: Difficulty;
}

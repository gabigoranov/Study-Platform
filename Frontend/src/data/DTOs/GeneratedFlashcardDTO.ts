import { MaterialDTO } from "./MaterialDTO";

export type GeneratedFlashcardDTO = {
  front: string;
  back: string;
  title: string;
  materialSubGroupId?: string | null;
}

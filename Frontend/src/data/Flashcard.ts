import { Material } from "./Material";

export type Flashcard = Material & {
  front: string;
  back: string;
}
import { Difficulty } from "../Difficulty";

export type MaterialDTO = {
    id: number;
    title: string;
    userId: string;
    materialSubGroupId: number;
    dateCreated: Date;
    difficulty: Difficulty;
}
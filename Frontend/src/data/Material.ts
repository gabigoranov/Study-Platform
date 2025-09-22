import { Difficulty } from "./Difficulty";

export type Material = {
    id: number;
    title: string;
    userId: string;
    materialSubGroupId: number;
    dateCreated: Date;
    difficulty: Difficulty;
}
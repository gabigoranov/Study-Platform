import { Material } from "./Material";

export type MaterialSubGroup = {
    id: number;
    title: string;
    subjectId: number;
    materialGroupType: string;
    dateCreated: Date;
    materials: Material[];
}
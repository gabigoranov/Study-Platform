import { Material } from "./Material";

export type MaterialSubGroup = {
    id: string;
    title: string;
    subjectId: string;
    materialGroupType: string;
    dateCreated: Date;
    materials: Material[];
}
import { MaterialSubGroup } from "./MaterialSubGroup";

export type Subject = {
    id: number;
    title: string;
    userId: string;
    dateCreated: Date;
    materialSubGroups: MaterialSubGroup[];
}
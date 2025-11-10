import { MaterialSubGroup } from "./MaterialSubGroup";

export type Subject = {
    id: string;
    title: string;
    userId: string;
    dateCreated: Date;
    materialSubGroups: MaterialSubGroup[];
    materialSubGroupsLength: number;
}
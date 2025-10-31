import { Difficulty } from "../Difficulty";
import { MindmapEdgeDTO, MindmapNodeDTO } from "./GeneratedMindmapDTO";

export interface MindmapDTO {
  id: string; // Guid
  title: string;
  description: string;
  subjectId: number;
  materialSubGroupId: number;
  userId: string; // UUID from Supabase auth
  data: {
    nodes: MindmapNodeDTO[];
    edges: MindmapEdgeDTO[];
  };
  dateCreated: string; // ISO date string (from DateTime)
  difficulty: Difficulty;
}

import { Difficulty } from "../Difficulty";
import { MindmapEdgeDTO, MindmapNodeDTO } from "./GeneratedMindmapDTO";

export interface CreateMindmapDTO {
  title: string;
  description: string;
  subjectId: string;
  materialSubGroupId: string;
  data: {
    nodes: MindmapNodeDTO[];
    edges: MindmapEdgeDTO[];
  };
  difficulty: Difficulty;
}

import { Difficulty } from "../Difficulty";
import { MindmapEdgeDTO, MindmapNodeDTO } from "./GeneratedMindmapDTO";

export interface MindmapDTO {
  nodes: MindmapNodeDTO[];
  edges: MindmapEdgeDTO[];
  materialSubGroupId?: number | null;
//   title: string;
//   difficulty: Difficulty
}

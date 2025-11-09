import { Difficulty } from "../Difficulty";

export interface GeneratedMindmapDTO {
  nodes: MindmapNodeDTO[];
  edges: MindmapEdgeDTO[];
  materialSubGroupId?: string | null;
  title: string;
  description: string;
  difficulty: Difficulty;
}

export interface MindmapNodeDTO {
  id: string;
  data: NodeDataDTO;
  position: NodePositionDTO;
}

export interface NodeDataDTO {
  label: string;
}

export interface NodePositionDTO {
  x: number;
  y: number;
}

export interface MindmapEdgeDTO {
  id: string;
  source: string;
  target: string;
  label: string;
}

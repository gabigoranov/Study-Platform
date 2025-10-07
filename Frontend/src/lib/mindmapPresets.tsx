// src/data/mindmapPresets.ts
import { Node, Edge } from "@xyflow/react";

export type MindmapType = "unconnected" | "connected" | "diagram" | "scheme";

// Centralized helper to create nodes with consistent defaults
const createNode = (id: string, x: number, y: number, label?: string): Node => ({
  id,
  position: { x, y },
  data: { label: label ?? `Node ${id}` },
  type: "default",
});

// Different example presets
export const mindmapPresets: Record<MindmapType, { nodes: Node[]; edges: Edge[] }> = {
  unconnected: {
    nodes: [
      createNode("n1", 0, 0, "Idea A"),
      createNode("n2", 200, 0, "Idea B"),
      createNode("n3", 0, 140, "Idea C"),
      createNode("n4", 200, 140, "Idea D"),
    ],
    edges: [],
  },
  connected: {
    nodes: [
      createNode("n1", 0, 0, "Central"),
      createNode("n2", 200, -60, "Branch 1"),
      createNode("n3", 200, 60, "Branch 2"),
      createNode("n4", 400, 0, "Leaf"),
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2" },
      { id: "e2", source: "n1", target: "n3" },
      { id: "e3", source: "n2", target: "n4" },
    ],
  },
  diagram: {
    nodes: [
      createNode("start", 0, 0, "Start"),
      createNode("process1", 200, 0, "Process"),
      createNode("decision", 400, 0, "Decision"),
      createNode("end", 600, 0, "End"),
    ],
    edges: [
      { id: "e1", source: "start", target: "process1" },
      { id: "e2", source: "process1", target: "decision" },
      { id: "e3", source: "decision", target: "end" },
    ],
  },
  scheme: {
    nodes: [
      createNode("s1", 0, 0, "Module A"),
      createNode("s2", 180, -90, "Module B"),
      createNode("s3", 180, 90, "Module C"),
      createNode("s4", 360, 0, "Module D"),
      createNode("s5", 540, 0, "Module E"),
    ],
    edges: [
      { id: "s1-s2", source: "s1", target: "s2" },
      { id: "s1-s3", source: "s1", target: "s3" },
      { id: "s2-s4", source: "s2", target: "s4" },
      { id: "s3-s4", source: "s3", target: "s4" },
      { id: "s4-s5", source: "s4", target: "s5" },
    ],
  },
};

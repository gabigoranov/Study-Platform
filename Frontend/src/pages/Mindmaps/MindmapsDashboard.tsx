import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  MiniMap,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/hooks/useThemeProvider";

/* --------------------------
   Types and Preset Factory
--------------------------- */

type MindmapType = "unconnected" | "connected" | "diagram" | "scheme";

/**
 * Small helper to create nodes with consistent defaults.
 * keeps creation centralized for easier adjustments later.
 */
const createNode = (id: string, x: number, y: number, label?: string): Node => ({
  id,
  position: { x, y },
  data: { label: label ?? `Node ${id}` },
  type: "default",
});

/**
 * Returns preset nodes and edges for each mindmap type.
 * Pure function so it's safe to call from effects or event handlers.
 */
const getPreset = (type: MindmapType): { nodes: Node[]; edges: Edge[] } => {
  switch (type) {
    case "unconnected":
      return {
        nodes: [
          createNode("n1", 0, 0, "Idea A"),
          createNode("n2", 200, 0, "Idea B"),
          createNode("n3", 0, 140, "Idea C"),
          createNode("n4", 200, 140, "Idea D"),
        ],
        edges: [],
      };

    case "connected":
      return {
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
      };

    case "diagram":
      return {
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
      };

    case "scheme":
      return {
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
      };

    default:
      return { nodes: [], edges: [] };
  }
};

/* --------------------------
   Component
--------------------------- */

export default function MindmapsDashboard(): JSX.Element {
  // Default preset
  const [mindmapType, setMindmapType] = useState<MindmapType>("connected");

  // Initialize nodes & edges from the default preset
  const initial = useMemo(() => getPreset(mindmapType), []);
  const [nodes, setNodes] = useState<Node[]>(initial.nodes);
  const [edges, setEdges] = useState<Edge[]>(initial.edges);

  // Theme for ReactFlow color mode (keeps dark mode responsive)
  const { theme } = useTheme();

  /* --------------------------
     ReactFlow change handlers
  --------------------------- */

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          { ...connection, id: `${connection.source}-${connection.target}` },
          eds
        )
      ),
    []
  );

  /* --------------------------
     Preset switching
     - When user selects a new mindmap type we replace nodes & edges.
     - We keep it explicit so the action is obvious and reversible by undo if ReactFlow supports it.
  --------------------------- */

  useEffect(() => {
    // Apply preset whenever mindmapType changes
    const preset = getPreset(mindmapType);
    setNodes(preset.nodes);
    setEdges(preset.edges);
    // fitView will be handled by ReactFlow prop
  }, [mindmapType]);

  /* --------------------------
     UI Helpers
  --------------------------- */

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // cast safely from string to MindmapType
    setMindmapType(e.target.value as MindmapType);
  };

  /* --------------------------
     Render
  --------------------------- */

  return (
    <div className="w-full h-full bg-[hsl(var(--background))] text-[hsl(var(--text))] p-4">
      <div className="mx-auto h-full bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-lg overflow-hidden border border-[hsl(var(--border))] flex flex-col">
        {/* Toolbar: responsive, accessible controls */}
        <header className="flex items-center justify-between gap-4 p-3 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">Mindmaps</h3>
            <p className="text-sm text-[hsl(var(--muted))]">Choose a layout</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mindmap type selector */}
            <label htmlFor="mindmap-type" className="sr-only">
              Select mindmap type
            </label>
            <select
              id="mindmap-type"
              value={mindmapType}
              onChange={handleTypeChange}
              className="rounded-md px-2 py-1 bg-[hsl(var(--input))] text-[hsl(var(--input-foreground))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            >
              <option value="unconnected">Unconnected Nodes</option>
              <option value="connected">Connected Nodes</option>
              <option value="diagram">Diagram (Flow)</option>
              <option value="scheme">Scheme (Modules)</option>
            </select>

            {/* Quick actions (kept simple/responsive) */}
            <button
              type="button"
              onClick={() => {
                // simple example action: center and refit by toggling nodes state slightly to trigger fitView
                setNodes((nds) => nds.map((n) => ({ ...n })));
              }}
              className="rounded-md px-3 py-1 bg-[hsl(var(--accent))] text-white text-sm hover:opacity-95"
            >
              Recenter
            </button>
          </div>
        </header>

        {/* Flow canvas: expands to fill available vertical space */}
        <main className="flex-1 min-h-0">
          <ReactFlow
            colorMode={theme}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Dotted background (keeps dark mode look because ReactFlow respects colorMode) */}
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />

            {/* Minimap and controls */}
            <MiniMap />
            <Controls />
          </ReactFlow>
        </main>
      </div>
    </div>
  );
}

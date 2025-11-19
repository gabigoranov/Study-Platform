"use client";

import React, { useCallback, useState, JSX, FormEvent } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/hooks/Theme/useThemeProvider";
import { LucideSave } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import dagre from "dagre";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import {
  MindmapNodeDTO,
  MindmapEdgeDTO,
} from "@/data/DTOs/GeneratedMindmapDTO";
import ErrorScreen from "@/components/Common/ErrorScreen";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";

interface ViewMindmapPageProps {
  mindmap?: MindmapDTO;
  nodes?: Node[];
  edges?: Edge[];
  handleSave: (updatedMindmap: MindmapDTO) => void;
  isInitialLayout?: boolean;
}

export default function ViewMindmapPage({
  mindmap,
  nodes: initialNodes,
  edges: initialEdges,
  handleSave,
  isInitialLayout = false,
}: ViewMindmapPageProps): JSX.Element {
  const { t } = useTranslation();
  
  // Determine if we have a mindmap object or separate nodes/edges
  const hasMindmapObject = mindmap !== undefined;
  
  // If no mindmap is provided and no initial nodes/edges are provided, show error
  if (!hasMindmapObject && (!initialNodes || !initialEdges)) {
    return (
      <ErrorScreen label={t("Please provide either a mindmap object or initial nodes and edges.")} />
    );
  }

  const { theme } = useTheme();

  // Convert MindmapDTO to ReactFlow format
  const convertToReactFlowNodes = (dtoNodes: MindmapNodeDTO[]): Node[] => {
    return dtoNodes.map((node) => ({
      id: node.id,
      data: { label: node.data.label },
      position: { x: node.position.x, y: node.position.y },
      type: "default",
    }));
  };

  const convertToReactFlowEdges = (dtoEdges: MindmapEdgeDTO[]): Edge[] => {
    return dtoEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    }));
  };

  // Convert ReactFlow format back to DTO format
  const convertToMindmapDTO = (nodes: Node[], edges: Edge[]): MindmapDTO => {
    if (hasMindmapObject && mindmap) {
      // If we have a mindmap object, preserve its metadata
      return {
        ...mindmap,
        data: {
          nodes: nodes.map((node) => ({
            id: node.id,
            data: { label: node.data.label as string },
            position: { x: node.position.x, y: node.position.y },
          })),
          edges: edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: (edge.label as string) || "",
          })),
        },
      };
    } else {
      // If we don't have a mindmap object, create a basic one with default values
      return {
        title: "Untitled Mindmap",
        description: "Generated mindmap",
        subjectId: "",
        materialSubGroupId: "",
        data: {
          nodes: nodes.map((node) => ({
            id: node.id,
            data: { label: node.data.label as string },
            position: { x: node.position.x, y: node.position.y },
          })),
          edges: edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: (edge.label as string) || "",
          })),
        },
        difficulty: 1, // Default to Medium difficulty
      };
    }
  };

  // Initialize nodes and edges based on the input type
  const [nodes, setNodes] = useState<Node[]>(
    hasMindmapObject && mindmap
      ? convertToReactFlowNodes(mindmap.data.nodes)
      : initialNodes || []
  );
  
  const [edges, setEdges] = useState<Edge[]>(
    hasMindmapObject && mindmap
      ? convertToReactFlowEdges(mindmap.data.edges)
      : initialEdges || []
  );
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [isInitialAlignment, setIsInitialAlignment] = useState<boolean>(
    isInitialLayout
  );

  const reactFlowInstance = useReactFlow();

  

  /* --------------------------
      ReactFlow handlers
  --------------------------- */

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      setHasUnsavedChanges(true);
      return applyNodeChanges(changes, nds);
    });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      setHasUnsavedChanges(true);
      return applyEdgeChanges(changes, eds);
    });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setHasUnsavedChanges(true);
    setEdges((eds) =>
      addEdge(
        { ...connection, id: `${connection.source}-${connection.target}` },
        eds
      )
    );
  }, []);

  /* --------------------------
      Node placement logic
  --------------------------- */

  const handleStartPlacing = (e: FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;
    setShowLabelModal(false);
    setIsPlacing(true);
  };

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isPlacing) return;

      const id = `n-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 30,
        y: event.clientY - 30,
      });

      const newNode: Node = {
        id,
        data: { label: newNodeLabel || t(keys.newNode) },
        position,
        type: "default",
      };

      setNodes((prev) => [...prev, newNode]);
      setHasUnsavedChanges(true);
      setNewNodeLabel("");
      setIsPlacing(false);
    },
    [isPlacing, newNodeLabel, reactFlowInstance]
  );

  const cancelPlacement = () => {
    setIsPlacing(false);
    setNewNodeLabel("");
  };

  const handleSaveClick = () => {
    const updatedMindmap = convertToMindmapDTO(nodes, edges);
    handleSave(updatedMindmap);
    setHasUnsavedChanges(false);
  };

  /* --------------------------
      Dagre auto-layout
  --------------------------- */

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 180;
  const nodeHeight = 60;

  const handleAutoLayout = () => {
    dagreGraph.setGraph({ rankdir: "TB", marginx: 0, marginy: 0 });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    setNodes(layoutedNodes);

    // Automatically save after aligning
    const updatedMindmap = convertToMindmapDTO(layoutedNodes, edges);
    handleSave(updatedMindmap);
    setHasUnsavedChanges(false);
  };

  // Auto-align nodes on initial load when isInitialLayout is true
  React.useEffect(() => {
    if (isInitialAlignment && nodes.length > 0) {
      // Small delay to ensure ReactFlow is ready
      const timer = setTimeout(() => {
        handleAutoLayout();
        setIsInitialAlignment(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInitialAlignment, nodes.length, handleAutoLayout]);

  /* --------------------------
      Render
  --------------------------- */

  return (
    <div className="w-full h-full relative">
      {/* Header with mindmap title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-card border border-border rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold text-card-foreground">
          {hasMindmapObject && mindmap ? mindmap.title : "Mindmap Review"}
        </h1>
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        <Button onClick={() => setShowLabelModal(true)}>+ {t(keys.addNode)}</Button>
        {isPlacing && (
          <Button variant="outline" onClick={cancelPlacement}>
            {t(keys.cancel)}
          </Button>
        )}
        {hasUnsavedChanges && (
          <Button onClick={handleSaveClick} variant="secondary">
            <LucideSave /> {t(keys.save)}
          </Button>
        )}
        <Button variant="outline" onClick={handleAutoLayout}>
          {t(keys.alignNodes)}
        </Button>
      </div>

      {/* Instruction ribbon */}
      {isPlacing && (
        <div className="absolute top-4 right-4 z-40 px-3 py-2 rounded-md text-sm bg-card text-card-foreground border border-border shadow-md max-w-xs">
          {t(keys.clickCanvasPlaceNode)}{" "}
          <strong className="whitespace-nowrap">{newNodeLabel}</strong>
        </div>
      )}

      {/* ReactFlow canvas */}
      <div
        className={`h-full rounded-xl border border-border overflow-hidden shadow-md bg-background ${
          isPlacing ? "cursor-crosshair" : "cursor-default"
        }`}
      >
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
          onPaneClick={handlePaneClick as any}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Label modal */}
      {showLabelModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 p-5 rounded-xl bg-card text-card-foreground border border-border shadow-lg">
            <h3 className="text-lg font-medium mb-3">{t(keys.addNode)}</h3>
            <form onSubmit={handleStartPlacing} className="flex flex-col gap-3">
              <Label className="text-sm">{t(keys.label)}</Label>
              <Input
                autoFocus
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder={t(keys.enterNodeLabel)}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                {t(keys.afterSubmitClickCanvas)}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowLabelModal(false)}
                >
                  {t(keys.cancel)}
                </Button>
                <Button type="submit">{t(keys.place)}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

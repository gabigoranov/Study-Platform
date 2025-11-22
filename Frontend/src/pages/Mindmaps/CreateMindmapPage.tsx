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
import { LucideSave, LucideTrash2 } from "lucide-react"; // Added LucideTrash2
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dagre from "dagre";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { Difficulty } from "@/data/Difficulty";
import { MindmapEdgeDTO, MindmapNodeDTO } from "@/data/DTOs/GeneratedMindmapDTO";
import { useVariableContext } from "@/context/VariableContext";

interface CreateMindmapsPageProps {
  nodes: Node[];
  edges: Edge[];
  handleCreate: (data: MindmapDTO) => void;
  isInitialLayout: boolean | undefined;
}

export default function CreateMindmapPage({
  nodes: initialNodes,
  edges: initialEdges,
  handleCreate,
  isInitialLayout,
}: CreateMindmapsPageProps): JSX.Element {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { selectedSubjectId, selectedGroupId } = useVariableContext();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Node Creation State
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  
  // Edge Labeling State
  const [showEdgeLabelModal, setShowEdgeLabelModal] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState("");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [isInitialAlignment, setIsInitialAlignment] = useState<boolean>(
    isInitialLayout ?? false
  );
  
  // State for mindmap creation modal
  const [showMindmapModal, setShowMindmapModal] = useState(false);
  const [mindmapTitle, setMindmapTitle] = useState("");
  const [mindmapDescription, setMindmapDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);

  const reactFlowInstance = useReactFlow();

  // Auto-align nodes on initial load
  React.useEffect(() => {
    if (isInitialAlignment && nodes.length > 0) {
      const timer = setTimeout(() => {
        handleAutoLayout();
        setIsInitialAlignment(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialAlignment, nodes.length]);

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

  // NEW: Handle clicking an edge to edit its label
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdgeId(edge.id);
    // Try to get existing label from data or top-level property
    const currentLabel = (edge.data?.label as string) || (edge.label as string) || "";
    setEdgeLabel(currentLabel);
    setShowEdgeLabelModal(true);
  }, []);

  // NEW: Handle deleting selected nodes/edges
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      reactFlowInstance.deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, reactFlowInstance]);

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

  /* --------------------------
      Edge Label logic
  --------------------------- */

  const handleEdgeLabelSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedEdgeId) return;

    setEdges((eds) => 
      eds.map((edge) => {
        if (edge.id === selectedEdgeId) {
          return {
            ...edge,
            label: edgeLabel, // Update visual label
            data: { ...edge.data, label: edgeLabel } // Update data for DTO
          };
        }
        return edge;
      })
    );

    setHasUnsavedChanges(true);
    setShowEdgeLabelModal(false);
    setEdgeLabel("");
    setSelectedEdgeId(null);
  };

  /* --------------------------
      Saving logic
  --------------------------- */

  const handleSaveClick = () => {
    setShowMindmapModal(true);
  };

  const handleMindmapSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const mindmapData: MindmapDTO = {
      title: mindmapTitle,
      description: mindmapDescription,
      subjectId: selectedSubjectId || "",
      materialSubGroupId: selectedGroupId || "",
      data: {
        nodes: nodes.map(node => ({
          id: node.id,
          data: { label: node.data.label },
          position: { x: node.position.x, y: node.position.y }
        })) as MindmapNodeDTO[],
        edges: edges.map(edge => ({
          id: edge.id || `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: (edge.data?.label as string) || ""
        }))  as MindmapEdgeDTO[]
      },
      difficulty: difficulty
    };
    
    handleCreate(mindmapData);
    
    setMindmapTitle("");
    setMindmapDescription("");
    setDifficulty(Difficulty.Medium);
    setShowMindmapModal(false);
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
    dagreGraph.setGraph({ rankdir: "TB", marginx: 50, marginy: 50 });

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
    setHasUnsavedChanges(true);
  };

  /* --------------------------
      Render
  --------------------------- */

  return (
    <div className="w-full h-full relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        <Button onClick={() => setShowLabelModal(true)}>+ {t(keys.addNode)}</Button>
        
        {isPlacing && (
          <Button variant="outline" onClick={cancelPlacement}>
            {t(keys.cancel)}
          </Button>
        )}
        
        {/* Delete Button */}
        <Button variant="destructive" size="icon" onClick={handleDeleteSelected} title="Delete selected">
            <LucideTrash2 className="h-4 w-4" />
        </Button>

        {hasUnsavedChanges && (
          <Button onClick={handleSaveClick} variant="secondary">
            <LucideSave className="mr-2 h-4 w-4" /> {t(keys.save)}
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
        className={`h-full rounded-xl border border-border overflow-hidden shadow-md bg-background ${isPlacing ? "cursor-crosshair" : "cursor-default"}`}
      >
        <ReactFlow
          colorMode={theme}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick} // Added click handler for edges
          fitView
          proOptions={{ hideAttribution: true }}
          style={{ width: "100%", height: "100%" }}
          onPaneClick={handlePaneClick as any}
          deleteKeyCode={["Backspace", "Delete"]} // Ensures keyboard delete still works
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Node Label Modal */}
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
              <p className="text-xs text-muted-foreground mt-1">
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

      {/* Edge Label Modal */}
      {showEdgeLabelModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 p-5 rounded-xl bg-card text-card-foreground border border-border shadow-lg">
            <h3 className="text-lg font-medium mb-3">Label Link</h3>
            <form onSubmit={handleEdgeLabelSubmit} className="flex flex-col gap-3">
              <Label className="text-sm">Link Label</Label>
              <Input
                autoFocus
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                placeholder="Enter relationship name..."
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEdgeLabelModal(false);
                    setEdgeLabel("");
                    setSelectedEdgeId(null);
                  }}
                >
                  {t(keys.cancel)}
                </Button>
                <Button type="submit">Set Label</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mindmap creation modal */}
      {showMindmapModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 p-5 rounded-xl bg-card text-card-foreground border border-border shadow-lg">
            <h3 className="text-lg font-medium mb-3">{t(keys.createNewMindmap)}</h3>
            <form onSubmit={handleMindmapSubmit} className="flex flex-col gap-3">
              <div>
                <Label className="text-sm">{t("Title")}</Label>
                <Input
                  value={mindmapTitle}
                  onChange={(e) => setMindmapTitle(e.target.value)}
                  placeholder={t(keys.enterMindmapTitle)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-sm">{t("Description")}</Label>
                <Input
                  value={mindmapDescription}
                  onChange={(e) => setMindmapDescription(e.target.value)}
                  placeholder={t(keys.enterMindmapDescription)}
                  required
                />
              </div>
              <div>
                <Label className="text-sm">{t("Difficulty")}</Label>
                <Select 
                  value={difficulty.toString()} 
                  onValueChange={(value) => setDifficulty(Number(value) as Difficulty)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Difficulty.Easy.toString()}>{t("Easy")}</SelectItem>
                    <SelectItem value={Difficulty.Medium.toString()}>{t("Medium")}</SelectItem>
                    <SelectItem value={Difficulty.Hard.toString()}>{t("Hard")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowMindmapModal(false);
                    setMindmapTitle("");
                    setMindmapDescription("");
                  }}
                >
                  {t(keys.cancel)}
                </Button>
                <Button type="submit">{t(keys.createMindmap)}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
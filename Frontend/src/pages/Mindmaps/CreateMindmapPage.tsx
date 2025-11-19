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
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
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
      // Small delay to ensure ReactFlow is ready
      const timer = setTimeout(() => {
        handleAutoLayout();
        setIsInitialAlignment(false); // ← Add this line!
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
    // Show the modal to collect mindmap information
    setShowMindmapModal(true);
  };

  // Handle the mindmap creation form submission
  const handleMindmapSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Create MindmapDTO object with the collected information
    const mindmapData: MindmapDTO = {
      title: mindmapTitle,
      description: mindmapDescription,
      subjectId: selectedSubjectId || "", // Use selectedSubjectId from VariableContext
      materialSubGroupId: selectedGroupId || "", // Use selectedGroupId from VariableContext
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
          label: edge.data?.label || ""
        }))  as MindmapEdgeDTO[]
      },
      difficulty: difficulty
    };
    
    // Call the handleCreate function passed as prop
    handleCreate(mindmapData);
    
    // Reset form and close modal
    setMindmapTitle("");
    setMindmapDescription("");
    setDifficulty(Difficulty.Medium);
    setShowMindmapModal(false);
    
    // Reset unsaved changes
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
        className={`h-full rounded-xl border border-border overflow-hidden shadow-md bg-background ${isPlacing ? "cursor-crosshair" : "cursor-default"}`}
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

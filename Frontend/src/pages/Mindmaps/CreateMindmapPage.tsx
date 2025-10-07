"use client";

import React, { useCallback, useState, JSX, FormEvent, useRef } from "react";
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
import { useTheme } from "@/hooks/useThemeProvider";
import { LucideSave } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CreateMindmapsPageProps {
  nodes: Node[];
  edges: Edge[];
  handleSave: (nodes: Node[], edges: Edge[]) => void;
}

/**
 * Display-only mindmap page that:
 * - Receives nodes & edges via props
 * - Lets user add a node via a label popup, then place it by clicking the canvas
 * - Shows a Save button (calls parent's handleSave) when there are unsaved changes
 */
export default function CreateMindmapPage({
  nodes: initialNodes,
  edges: initialEdges,
  handleSave,
}: CreateMindmapsPageProps): JSX.Element {
  const { theme } = useTheme();

  // Local editable copies
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // UI state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

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
     Placement logic
     - Step 1: user clicks "Add Node" -> modal to enter label
     - Step 2: after submitting label we enter "placing" mode
     - Step 3: user clicks *on the ReactFlow pane* to place node at that position
  --------------------------- */

  // Submit the label; enter placement mode
  const handleStartPlacing = (e: FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;
    setShowLabelModal(false);
    setIsPlacing(true);
    // keep the label in state until placed
  };

  // User clicked the ReactFlow pane — position is supplied by the onPaneClick handler
  // ReactFlow typically calls onPaneClick(event, position) where position is world coords.
  const reactFlowInstance = useReactFlow();

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isPlacing) return;

      // coords is already in world coordinates
      const id = `n-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

      // translate mouse position to graph position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 30,
        y: event.clientY - 30,
      });

      const newNode: Node = {
        id,
        data: { label: newNodeLabel || "New Node" },
        position: position,
        type: "default",
      };

      setNodes((prev) => [...prev, newNode]);
      setHasUnsavedChanges(true);
      setNewNodeLabel("");
      setIsPlacing(false);
    },
    [isPlacing, newNodeLabel]
  );

  const cancelPlacement = () => {
    setIsPlacing(false);
    setNewNodeLabel("");
  };

  const handleSaveClick = () => {
    handleSave(nodes, edges);
    setHasUnsavedChanges(false);
  };

  /* --------------------------
     UI (using project color variables)
  --------------------------- */

  return (
    <div className="w-full h-full relative">
      {/* Top-left toolbar */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        <Button
          onClick={() => setShowLabelModal(true)}
        >
          + Add Node
        </Button>

        {isPlacing && (
          <Button
            variant="outline"
            onClick={cancelPlacement}
          >
            Cancel
          </Button>
        )}

        {hasUnsavedChanges && (
          <Button
            onClick={handleSaveClick}
            variant="secondary"
          >
            <LucideSave /> Save
          </Button>
        )}
      </div>

      {/* Instruction ribbon shown while placing - moved to TOP RIGHT */}
      {isPlacing && (
        <div className="absolute top-4 right-4 z-40 px-3 py-2 rounded-md text-sm bg-card text-card-foreground border border-border shadow-md max-w-xs">
          Click anywhere on the canvas to place the node —{" "}
          <strong className="whitespace-nowrap">{newNodeLabel}</strong>
        </div>
      )}

      {/* The ReactFlow canvas.
          We add 'cursor-crosshair' to the wrapper while placing to indicate placement mode.
      */}
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
          // IMPORTANT: this is the handler that receives pane click coords.
          // ReactFlow provides the world coordinates as the second argument (position).
          onPaneClick={handlePaneClick as any}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      {/* Label input modal (only label required; coordinates chosen via canvas click) */}
      {showLabelModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 p-5 rounded-xl bg-card text-card-foreground border border-border shadow-lg">
            <h3 className="text-lg font-medium mb-3">Add Node</h3>

            <form onSubmit={handleStartPlacing} className="flex flex-col gap-3">
              <Label className="text-sm">Label</Label>
              <Input
                autoFocus
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Enter node label"
                required
              />

              <p className="text-xs text-text-muted mt-1">
                After you submit, click anywhere on the canvas to place the
                node.
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowLabelModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Place
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

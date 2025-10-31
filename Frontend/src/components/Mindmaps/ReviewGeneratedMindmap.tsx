"use client";

import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import Loading from "../Common/Loading";
import ErrorScreen from "../Common/ErrorScreen";
import CreateMindmapPage from "@/pages/Mindmaps/CreateMindmapPage";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { Node, Edge } from "@xyflow/react";
import { t } from "i18next";
import { keys } from "@/types/keys";
import { GeneratedMindmapDTO, MindmapEdgeDTO, MindmapNodeDTO } from "@/data/DTOs/GeneratedMindmapDTO";

type ReviewGeneratedMindmapProps = {
  mindmap: GeneratedMindmapDTO;
  onApprove: (mindmap: GeneratedMindmapDTO) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: boolean;
};

export default function ReviewGeneratedMindmap({
  mindmap,
  onApprove,
  onCancel,
  loading = false,
  error = false,
}: ReviewGeneratedMindmapProps) {
  const [data, setData] = useState<GeneratedMindmapDTO>(mindmap);
  const [isEditing, setIsEditing] = useState(false);

  // ----------------------------
  // Map DTOs to ReactFlow Nodes/Edges
  // ----------------------------
  const nodes: Node[] = useMemo(
    () =>
      data.nodes.map((n: MindmapNodeDTO) => ({
        id: n.id,
        data: { label: n.data.label as string }, // cast to string
        position: n.position,
        type: "default",
      })),
    [data.nodes]
  );

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((e: MindmapEdgeDTO) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label as string,
      })),
    [data.edges]
  );

  // ----------------------------
  // Handle saving changes from editor
  // ----------------------------
  const handleSave = (updatedNodes: Node[], updatedEdges: Edge[]) => {
    // Convert back to DTO format
    const updatedMindmap: GeneratedMindmapDTO = {
      ...data,
      nodes: updatedNodes.map((n) => ({
        id: n.id,
        data: { label: n.data.label as string }, // cast to string
        position: n.position,
      })),
      edges: updatedEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: (e.label as string) || "",
      })),
    };
    setData(updatedMindmap);
    setIsEditing(false);
  };

  // ----------------------------
  // Render
  // ----------------------------
  if (error) {
    return <ErrorScreen onRetry={() => onApprove(data)} onCancel={onCancel} />;
  }

  if (loading) {
    return (
      <Loading
        isLoading={loading}
        label={t(keys.loadingMindmapLabel) || "Loading mindmap..."}
      />
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="secondary" onClick={() => onApprove(data)}>
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Mindmap Editor / Viewer */}
      <div className="h-[calc(100%-4rem)]">
        <CreateMindmapPage
          nodes={nodes}
          edges={edges}
          handleSave={isEditing ? handleSave : () => {}}
          isInitialLayout={true}
        />
      </div>
    </div>
  );
}

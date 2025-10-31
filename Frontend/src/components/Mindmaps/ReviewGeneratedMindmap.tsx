"use client";

import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import Loading from "../Common/Loading";
import ErrorScreen from "../Common/ErrorScreen";
import CreateMindmapPage from "@/pages/Mindmaps/CreateMindmapPage";
import { Node, Edge } from "@xyflow/react";
import { t } from "i18next";
import { keys } from "@/types/keys";
import {
  GeneratedMindmapDTO,
  MindmapEdgeDTO,
  MindmapNodeDTO,
} from "@/data/DTOs/GeneratedMindmapDTO";
import DifficultyTag from "../Common/DifficultyTag";

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

  const nodes: Node[] = useMemo(
    () =>
      data.nodes.map((n: MindmapNodeDTO) => ({
        id: n.id,
        data: { label: n.data.label as string },
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

  const handleSave = (updatedNodes: Node[], updatedEdges: Edge[]) => {
    const updatedMindmap: GeneratedMindmapDTO = {
      ...data,
      nodes: updatedNodes.map((n) => ({
        id: n.id,
        data: { label: n.data.label as string },
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
    <div className="relative w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-4 shrink-0">
        {/* Title, Description, Difficulty */}
        <div>
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <DifficultyTag difficulty={data.difficulty} />
          </div>
          <p className="text-gray-700 mt-1">{data.description}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-start">
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
      <div className="flex-1 min-h-0">
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

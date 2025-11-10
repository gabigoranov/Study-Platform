import React from "react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import MindmapSkeleton from "./MindmapSkeleton";
import MindmapDashboardComponent from "./MindmapDashboardComponent";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import ViewMindmapSkeleton from "./ViewMindmapSekeleton";
import { Mindmap } from "@/data/Mindmap";

interface MindmapsDashboardListProps {
  mindmaps: Mindmap[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  loading?: boolean;
}

export default function MindmapsDashboardList({
  mindmaps,
  onSelect,
  selectedId,
  loading = false,
}: MindmapsDashboardListProps) {
  const { t } = useTranslation();

  function renderSkeletons(count: number) {
    return Array.from({ length: count }, (_, i) => <ViewMindmapSkeleton key={i} />);
  }

  // Render skeletons while loading
  if (loading) {
    return (
      <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-start overflow-x-hidden">
        {renderSkeletons(9)}
      </div>
    );
  }

  if (mindmaps.length === 0) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="p-8 text-center text-text-muted">
          {t(keys.noMindmaps) ?? "No mindmaps found"}
        </p>
      </div>
    );
  }


  return (
    <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-start overflow-x-hidden">
      {mindmaps.map((mindmap) => (
        <MindmapDashboardComponent
          key={mindmap.id}
          mindmap={mindmap}
          onSelect={onSelect}
          isSelected={selectedId === mindmap.id}
        />
      ))}
    </div>
  );
}

import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { Difficulty } from "@/data/Difficulty";
import React from "react";
import DifficultyTag from "../Common/DifficultyTag";
import { Mindmap } from "@/data/Mindmap";

interface MindmapDashboardComponentProps {
  mindmap: Mindmap;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function MindmapDashboardComponent({
  mindmap,
  onSelect,
  isSelected,
}: MindmapDashboardComponentProps) {
  const nodeCount = mindmap.data?.nodes?.length || 0;
  
  return (
    <div
      onClick={() => onSelect(mindmap.id)}
      className={`cursor-pointer w-full max-w-sm p-8 rounded-3xl transition-all duration-200 bg-surface border border-border
        ${isSelected 
          ? "ring-1 ring-primary-dark" 
          : "hover:border-primary/10"
        }`}
    >
      {/* Header with title and optional difficulty tag */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-text leading-tight">
          {mindmap.title}
        </h3>
        <DifficultyTag difficulty={mindmap.difficulty} />
      </div>

      {/* Description with ample spacing */}
      {mindmap.description && (
        <p className="text-sm text-text leading-relaxed line-clamp-2 mb-8">
          {mindmap.description}
        </p>
      )}

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border">
        <span className="font-medium">
          {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
        </span>
        <time dateTime={mindmap.dateCreated}>
          {new Date(mindmap.dateCreated).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      </div>
    </div>
  );
}
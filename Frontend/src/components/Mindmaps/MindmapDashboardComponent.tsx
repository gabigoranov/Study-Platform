import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import React from "react";

interface MindmapDashboardComponentProps {
  mindmap: MindmapDTO;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function MindmapDashboardComponent({
  mindmap,
  onSelect,
  isSelected,
}: MindmapDashboardComponentProps) {
  return (
    <div
      onClick={() => onSelect(mindmap.id)}
      className={`cursor-pointer w-64 p-4 rounded-2xl shadow-sm border transition-all 
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"} 
        hover:shadow-md`}
    >
      <h3 className="text-lg font-semibold truncate">{mindmap.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{mindmap.description}</p>
      <div className="mt-2 text-xs text-gray-400">
        {new Date(mindmap.dateCreated).toLocaleDateString()}
      </div>
    </div>
  );
}

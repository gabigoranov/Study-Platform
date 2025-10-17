import React from "react";

export default function MindmapSkeleton() {
  return (
    <div className="w-full h-full min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {/* Center to top-left */}
        <line
          x1="50%"
          y1="50%"
          x2="20%"
          y2="20%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Center to top-right */}
        <line
          x1="50%"
          y1="50%"
          x2="80%"
          y2="25%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Center to bottom-left */}
        <line
          x1="50%"
          y1="50%"
          x2="25%"
          y2="75%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Center to bottom-right */}
        <line
          x1="50%"
          y1="50%"
          x2="75%"
          y2="70%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Top-left to sub-node */}
        <line
          x1="20%"
          y1="20%"
          x2="15%"
          y2="10%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        {/* Top-right to sub-nodes */}
        <line
          x1="80%"
          y1="25%"
          x2="85%"
          y2="15%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDelay: "200ms" }}
        />
        <line
          x1="80%"
          y1="25%"
          x2="90%"
          y2="35%"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDelay: "250ms" }}
        />
      </svg>

      {/* Center node (main) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-gray-200 animate-pulse rounded-2xl shadow-lg"
        style={{ zIndex: 10 }}
      >
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      {/* Top-left node */}
      <div
        className="absolute w-40 h-24 bg-gray-200 animate-pulse rounded-xl shadow-md"
        style={{ top: "20%", left: "20%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "100ms" }}
      >
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Top-right node */}
      <div
        className="absolute w-44 h-28 bg-gray-200 animate-pulse rounded-xl shadow-md"
        style={{ top: "25%", left: "80%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "150ms" }}
      >
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Bottom-left node */}
      <div
        className="absolute w-36 h-20 bg-gray-200 animate-pulse rounded-xl shadow-md"
        style={{ top: "75%", left: "25%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "200ms" }}
      >
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-2 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>

      {/* Bottom-right node */}
      <div
        className="absolute w-40 h-24 bg-gray-200 animate-pulse rounded-xl shadow-md"
        style={{ top: "70%", left: "75%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "250ms" }}
      >
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* Sub-node top-left */}
      <div
        className="absolute w-32 h-16 bg-gray-200 animate-pulse rounded-lg shadow-sm"
        style={{ top: "10%", left: "15%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "300ms" }}
      >
        <div className="p-2 space-y-1">
          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>

      {/* Sub-node top-right 1 */}
      <div
        className="absolute w-32 h-16 bg-gray-200 animate-pulse rounded-lg shadow-sm"
        style={{ top: "15%", left: "85%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "350ms" }}
      >
        <div className="p-2 space-y-1">
          <div className="h-2 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      {/* Sub-node top-right 2 */}
      <div
        className="absolute w-28 h-16 bg-gray-200 animate-pulse rounded-lg shadow-sm"
        style={{ top: "35%", left: "90%", transform: "translate(-50%, -50%)", zIndex: 10, animationDelay: "400ms" }}
      >
        <div className="p-2 space-y-1">
          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
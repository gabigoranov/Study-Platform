import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

export default function ViewMindmapSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      className="relative min-w-[50vw] sm:min-w-[400px] sm:max-w-[33.33%] min-h-[400px] bg-surface border border-border rounded-3xl p-6 flex flex-col items-center justify-center"
    >
      {/* Mindmap title */}
      <Skeleton className="h-6 w-2/3 mb-6" />

      {/* Center node */}
      <div className="relative flex items-center justify-center">
        <Skeleton className="h-16 w-40 rounded-full" />

        {/* Subnodes */}
        <div className="absolute -top-20 left-1/2 -translate-x-[140px]">
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <div className="absolute -top-20 right-1/2 translate-x-[140px]">
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <div className="absolute top-24 left-1/2 -translate-x-[180px]">
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
        <div className="absolute top-24 right-1/2 translate-x-[180px]">
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Skeleton className="h-8 w-20" />
      </div>
    </motion.div>
  );
}

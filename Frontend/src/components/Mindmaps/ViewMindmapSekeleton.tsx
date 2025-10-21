import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

export default function ViewMindmapSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      className="w-full max-w-sm p-8 rounded-3xl bg-surface border border-border"
    >
      {/* Header - title and optional tag space */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>

      {/* Description area with spacing */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </motion.div>
  );
}
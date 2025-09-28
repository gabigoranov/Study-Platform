import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import DifficultyTag from "../Common/DifficultyTag";
import { keys } from "@/types/keys";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export default function ViewFlashcardComponent() {
  return (
    <div
      className="relative min-w-[50vw] sm:min-w-[400px] sm:max-w-[33.33%] min-h-[400px] cursor-pointer [perspective:1000px] basis-[400px] flex-1"
    >
      <div
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* Front */}
        <div className="absolute w-full h-full rounded-3xl bg-surface p-4 border border-border [backface-visibility:hidden]">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-1/2" />

          {/* Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Skeleton className="h-8 w-20"/>
          </div>
        </div>
      </div>
    </div>
  );
}

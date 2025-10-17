import { useState } from "react";
import { useMindmapsGeneration } from "./useMindmapsGeneration";
import { useFlashcardsGeneration } from "./useFlashcardsGeneration";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";

export interface Action {
  id: string;
  title: string;
}

export type SubmitAction = (
  actionId: string,
  customPrompt: string,
  file: File | undefined
) => Promise<void>;

export function useGenerationActions() {
  const actions: Action[] = [
    {
      id: "generateFlashcards",
      title: "Generate Flashcards",
    },
    {
      id: "generateMindmaps",
      title: "Generate Mindmaps",
    },
  ];

  const [selectedActionId, setSelectedActionId] = useState<string | undefined>(
    actions[0].id
  );

  return { actions, selectedActionId, setSelectedActionId };
}

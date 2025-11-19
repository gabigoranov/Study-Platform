import { useState } from "react";
import { useMindmapsGeneration } from "../Mindmaps/useMindmapsGeneration";
import { useFlashcardsGeneration } from "../Flashcards/useFlashcardsGeneration";
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
      title: "Generate Mindmap",
    },
    {
      id: "generateQuizzes",
      title: "Generate Quiz",
    },
  ];

  const [selectedActionId, setSelectedActionId] = useState<string | undefined>(
    actions[0].id
  );

  return { actions, selectedActionId, setSelectedActionId };
}

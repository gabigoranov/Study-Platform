import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";
import { storageService } from "@/services/storageService";
import { flashcardService } from "@/services/flashcardService";
import { GeneratedFlashcardDTO } from "@/data/DTOs/GeneratedFlashcardDTO";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "@/data/Flashcard";
import { BASE_URL } from "@/types/urls";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GeneratedMindmapDTO } from "@/data/DTOs/GeneratedMindmapDTO";

export interface Action {
  id: string;
  title: string;
}

export type SubmitAction = (actionId: string, customPrompt: string) => Promise<void>;

export function useHandleMaterialGeneration(closeForm: () => void) {
  const { user, token } = useAuth();
  const { selectedGroupId } = useVariableContext();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [file, setFile] = useState<File>();
  const [generatedFlashcards, setGeneratedFlashcards] = useState<
    GeneratedFlashcardDTO[]
  >([]);

  const [generatedMindmap, setGeneratedMindmap] = useState<
    GeneratedMindmapDTO
  >();

  const [customPrompt, setCustomPrompt] = useState<string>();

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

  const handleSubmitFlashcards: SubmitAction = async (
    actionId,
    customPrompt
  ) => {
    if (!file) return;

    setError(false);
    setLoading(true);

    try {
      const downloadUrl = await storageService.uploadFile(
        user?.id as string,
        file,
        "user-files"
      );

      const response = await fetch(`${BASE_URL}/flashcards/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileDownloadUrl: downloadUrl, customPrompt: customPrompt }),
      });

      let json: GeneratedFlashcardDTO[] = await response.json();
      json.forEach((element) => {
        element.materialSubGroupId = selectedGroupId;
      });

      console.log(json);

      setGeneratedFlashcards(json);
      setReviewing(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMindmaps: SubmitAction = async (actionId, customPrompt) => {
    if (!file) return;

    setError(false);
    setLoading(true);

    try {
      const downloadUrl = await storageService.uploadFile(
        user?.id as string,
        file,
        "user-files"
      );

      const response = await fetch(`${BASE_URL}/mindmaps/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileDownloadUrl: downloadUrl, customPrompt: customPrompt }),
      });

      console.log(response);

      let json: GeneratedMindmapDTO = await response.json();
        json.materialSubGroupId = selectedGroupId;

      console.log(json);

      setGeneratedMindmap(json);
      setReviewing(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Define multiple actions, each with its own behavior
  const handleSubmitFromAction: Record<string, SubmitAction> = {
    generateFlashcards: handleSubmitFlashcards,
    generateMindmaps: handleSubmitMindmaps,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFile(e.target.files[0]);
  };

  const handleApprove = async (flashcards: FlashcardDTO[]) => {
    if (!token) return alert("You must be logged in to approve flashcards");

    setError(false);
    setLoading(true);
    setReviewing(false);

    try {
      const result = await flashcardService.createBulk(flashcards, token);
      queryClient.setQueryData<Flashcard[]>(
        ["flashcards", selectedGroupId],
        (old) => (old ? [...old, ...result] : [...result])
      );
    } catch (err) {
      setError(true);
      return;
    } finally {
      setLoading(false);
      closeForm();
    }
  };

  return {
    file,
    loading,
    error,
    reviewing,
    generatedFlashcards,
    selectedActionId,
    setSelectedActionId,
    customPrompt,
    setCustomPrompt,
    handleFileChange,
    handleSubmitFromAction,
    handleApprove,
    actions,
    generatedMindmap
  };
}

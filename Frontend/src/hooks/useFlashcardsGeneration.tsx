import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";
import { storageService } from "@/services/storageService";
import { flashcardService } from "@/services/flashcardService";
import { GeneratedFlashcardDTO } from "@/data/DTOs/GeneratedFlashcardDTO";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "@/data/Flashcard";
import { BASE_URL } from "@/types/urls";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GeneratedMindmapDTO } from "@/data/DTOs/GeneratedMindmapDTO";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { CreateMindmapDTO } from "@/data/DTOs/CreateMindmapDTO";
import { mindmapsService } from "@/services/mindmapsService";
import { SubmitAction, useGenerationActions } from "./useGenerationActions";

type FlashcardsGenerationProps = {
  setLoading: (value: boolean) => void;
  setError: (value: boolean) => void;
  setReviewing: (value: boolean) => void;
  closeForm: () => void;
};

export function useFlashcardsGeneration({
  setLoading,
  setError,
  setReviewing,
  closeForm,
}: FlashcardsGenerationProps) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [generatedFlashcards, setGeneratedFlashcards] = useState<
    GeneratedFlashcardDTO[]
  >([]);

  const { selectedGroupId } = useVariableContext();

  const handleSubmitGeneration: SubmitAction = async (
    actionId,
    customPrompt,
    file
  ) => {
    if (!file) return;

    console.log("file not null");

    setError(false);
    setLoading(true);

    try {
      const downloadUrl = await storageService.uploadFile(
        user?.id as string,
        file,
        "user-files"
      );

      console.log("generating");

      const response = await fetch(`${BASE_URL}/flashcards/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileDownloadUrl: downloadUrl,
          customPrompt: customPrompt,
        }),
      });

      console.log("generated");

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

  const handleApproveGeneration = async (flashcards: FlashcardDTO[]) => {
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
    generatedFlashcards,
    handleSubmitGeneration,
    handleApproveGeneration,
  };
}

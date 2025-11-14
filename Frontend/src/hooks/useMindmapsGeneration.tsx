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
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { CreateMindmapDTO } from "@/data/DTOs/CreateMindmapDTO";
import { mindmapsService } from "@/services/mindmapsService";
import { SubmitAction, useGenerationActions } from "./useGenerationActions";
import { Mindmap } from "@/data/Mindmap";
import { usersService } from "@/services/usersService";

type MindmapGenerationProps = {
  setLoading: (value: boolean) => void;
  setError: (value: boolean) => void;
  setReviewing: (value: boolean) => void;
  closeForm: () => void;
};

export function useMindmapsGeneration({
  setLoading,
  setError,
  setReviewing,
  closeForm,
}: MindmapGenerationProps) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [generatedMindmap, setGeneratedMindmap] =
    useState<GeneratedMindmapDTO>();

  const { selectedGroupId, selectedSubjectId } = useVariableContext();

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

      const response = await fetch(`${BASE_URL}/mindmaps/generate`, {
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

      await usersService.updateScore(token!, 20);

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

  const convertToCreateMindmapDTO = (
    generated: GeneratedMindmapDTO,
    options: {
      title: string;
      description: string;
      subjectId: string;
    }
  ): CreateMindmapDTO => {
    return {
      title: options.title,
      description: options.description,
      subjectId: options.subjectId,
      materialSubGroupId: generated.materialSubGroupId ?? "", // default to 0 if null/undefined
      data: {
        nodes: generated.nodes,
        edges: generated.edges,
      },
      difficulty: generated.difficulty,
    };
  };

  const handleApproveGeneration = async (mindmap: GeneratedMindmapDTO) => {
    console.log("approving");
    if (!token) return alert("You must be logged in to approve flashcards");

    setError(false);
    setLoading(true);
    setReviewing(false);

    try {
      const model = convertToCreateMindmapDTO(mindmap, {
        title: mindmap.title,
        description: mindmap.description,
        subjectId: selectedSubjectId!,
      });

      const result = await mindmapsService.create(model, token);

      console.log("updating query data");
      queryClient.setQueryData<Mindmap[]>(
        ["mindmaps", selectedGroupId, selectedSubjectId],
        (old) => (old ? [...old, result] : [result])
      );
    } catch (err) {
      console.log("an error: " + err);
      setError(true);
      return;
    } finally {
      console.log("done");
      setLoading(false);
      closeForm();
    }
  };

  return {
    generatedMindmap,
    handleApproveGeneration,
    handleSubmitGeneration,
  };
}

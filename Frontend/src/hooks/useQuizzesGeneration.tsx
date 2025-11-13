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
import { CreateQuizDTO } from "@/data/DTOs/CreateQuizDTO";
import { CreateQuizQuestionAnswerDTO } from "@/data/DTOs/CreateQuizQuestionAnswerDTO";
import { CreateQuizQuestionDTO } from "@/data/DTOs/CreateQuizQuestionDTO";
import { GeneratedQuizDTO } from "@/data/DTOs/GeneratedQuizDTO";
import { quizService } from "@/services/quizService";
import { QuizDTO } from "@/data/DTOs/QuizDTO";
import { Quiz } from "@/data/Quiz";

type QuizGenerationProps = {
  setLoading: (value: boolean) => void;
  setError: (value: boolean) => void;
  setReviewing: (value: boolean) => void;
  closeForm: () => void;
};

export function useQuizzesGeneration({
  setLoading,
  setError,
  setReviewing,
  closeForm,
}: QuizGenerationProps) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuizDTO>();

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

      const response = await fetch(`${BASE_URL}/quizzes/generate`, {
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

      console.log(response);

      let json: GeneratedQuizDTO = await response.json();
      json.materialSubGroupId = selectedGroupId;

      console.log(json);

      setGeneratedQuiz(json);
      setReviewing(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const convertToCreateQuizDTO = (
    generated: GeneratedQuizDTO
  ): CreateQuizDTO => {
    return {
      title: generated.title,
      description: generated.description,
      materialSubGroupId: generated.materialSubGroupId ?? "",
      difficulty: generated.difficulty,
      questions: generated.questions.map(
        (x): CreateQuizQuestionDTO => ({
          description: x.description,
          answers: x.answers.map(
            (y): CreateQuizQuestionAnswerDTO => ({
              description: y.description,
              isCorrect: y.isCorrect,
            })
          ),
        })
      ),
    };
  };

  const handleApproveGeneration = async (quiz: GeneratedQuizDTO) => {
    console.log("approving");
    if (!token) return alert("You must be logged in to approve flashcards");

    setError(false);
    setLoading(true);
    setReviewing(false);

    try {
      const model = convertToCreateQuizDTO(quiz);

      const result = await quizService.create(model, token);

      console.log("updating query data");
      queryClient.setQueryData<Quiz[]>(
        ["quizzes", selectedGroupId, selectedSubjectId],
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
    generatedQuiz,
    handleApproveGeneration,
    handleSubmitGeneration,
  };
}

import ReviewGeneratedFlashcards from "../Flashcards/ReviewGeneratedFlashcards";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import UploadFileForm from "./UploadFileForm";
import { AnimatePresence, motion } from "motion/react";
import ReviewGeneratedMindmap from "../Mindmaps/ReviewGeneratedMindmap";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { ReactFlowProvider } from "@xyflow/react";
import { GeneratedMindmapDTO } from "@/data/DTOs/GeneratedMindmapDTO";
import { SubmitAction, useGenerationActions } from "@/hooks/useGenerationActions";
import { useState } from "react";
import { useFlashcardsGeneration } from "@/hooks/useFlashcardsGeneration";
import { useMindmapsGeneration } from "@/hooks/useMindmapsGeneration";
import { GeneratedFlashcardDTO } from "@/data/DTOs/GeneratedFlashcardDTO";
import { Flashcard } from "@/data/Flashcard";
import { useQuizzesGeneration } from "@/hooks/useQuizzesGeneration";
import ReviewGeneratedQuiz from "../Quizzes/ReviewGeneratedQuiz";
import { GeneratedQuizDTO } from "@/data/DTOs/GeneratedQuizDTO";

type UploadFileMenuProps = {
  isFormOpen: boolean;
  closeForm: () => void;

  selectedActionId: string | undefined;
  setSelectedActionId: (id: string) => void;

  // Generation variables from parent
  file?: File;
  loading: boolean;
  error: boolean;
  reviewing: boolean;
  customPrompt?: string;
  setCustomPrompt: (value: string | undefined) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Setters for generation state
  setLoading: (value: boolean) => void;
  setReviewing: (value: boolean) => void;
  setError: (value: boolean) => void;
};

export type GenerationActionHandler = {
  id: string;
  title: string;
  handleSubmitGeneration: SubmitAction;
  handleApproveGeneration: (data: any) => Promise<void>;
};

export default function UploadFileMenu({
  isFormOpen,
  closeForm,
  selectedActionId,
  setSelectedActionId,
  file,
  loading,
  error,
  reviewing,
  customPrompt,
  setCustomPrompt,
  handleFileChange,
  setLoading,
  setReviewing,
  setError,
}: UploadFileMenuProps) {
  const {
    generatedFlashcards,
    handleApproveGeneration: handleApproveFlashcardsGeneration,
    handleSubmitGeneration: handleSubmitFlashcardsGeneration,
  } = useFlashcardsGeneration({
    setLoading,
    setReviewing,
    setError,
    closeForm,
  });

  const {
    generatedMindmap,
    handleApproveGeneration: handleApproveMindmapsGeneration,
    handleSubmitGeneration: handleSubmitMindmapsGeneration,
  } = useMindmapsGeneration({
    setLoading,
    setReviewing,
    setError,
    closeForm,
  });

  const {
    generatedQuiz,
    handleApproveGeneration: handleApproveQuizzesGeneration,
    handleSubmitGeneration: handleSubmitQuizzesGeneration,
  } = useQuizzesGeneration({
    setLoading,
    setReviewing,
    setError,
    closeForm,
  });

  const generationActionHandlerMap: Record<string, GenerationActionHandler> = {
    generateFlashcards: {
      id: "generateFlashcards",
      title: "Generate Flashcards",
      handleSubmitGeneration: handleSubmitFlashcardsGeneration,
      handleApproveGeneration: handleApproveFlashcardsGeneration,
    },
    generateMindmaps: {
      id: "generateMindmaps",
      title: "Generate Mindmaps",
      handleSubmitGeneration: handleSubmitMindmapsGeneration,
      handleApproveGeneration: handleApproveMindmapsGeneration,
    },
    generateQuizzes: {
      id: "generateQuizzes",
      title: "Generate Quizzes",
      handleSubmitGeneration: handleSubmitQuizzesGeneration,
      handleApproveGeneration: handleApproveQuizzesGeneration,
    },
  };

  const [selectedActionHandler, setSelectedActionHandler] = useState<GenerationActionHandler>(generationActionHandlerMap[selectedActionId ?? "generateFlashcards"]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 p-4 sm:p-12`}
      onClick={closeForm}
    >
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 p-4 sm:p-12"
        onClick={closeForm}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col sm:flex-row w-full h-full gap-4 p-6 bg-surface rounded-xl overflow-y-scroll sm:overflow-y-auto sm:overflow-x-auto scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {reviewing ? (
            selectedActionId == "generateFlashcards" ? (
              <ReviewGeneratedFlashcards
                flashcards={generatedFlashcards as FlashcardDTO[]}
                onCancel={closeForm}
                onApprove={selectedActionHandler.handleApproveGeneration}
                loading={loading}
                error={error}
              />
            ) : selectedActionId == "generateMindmaps" ? (
              <ReactFlowProvider>
                <ReviewGeneratedMindmap
                  mindmap={generatedMindmap as GeneratedMindmapDTO}
                  onApprove={selectedActionHandler.handleApproveGeneration}
                  onCancel={closeForm}
                  loading={false}
                  error={false}
                />
              </ReactFlowProvider>
            ) : selectedActionId == "generateQuizzes" ? (
              <ReactFlowProvider>
                <ReviewGeneratedQuiz
                  quiz={generatedQuiz as GeneratedQuizDTO}
                  onApprove={selectedActionHandler.handleApproveGeneration}
                  onCancel={closeForm}
                  loading={false}
                  error={false}
                />
              </ReactFlowProvider>
            ) : null
          ) : (
            <UploadFileForm
              selectedActionId={selectedActionId}
              setSelectedActionId={(e) => setSelectedActionId}
              resetForm={closeForm}
              closeForm={closeForm}
              selectedActionHandler={selectedActionHandler}
              file={file}
              loading={loading}
              error={error}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              handleFileChange={handleFileChange}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

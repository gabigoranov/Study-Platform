import ReviewGeneratedFlashcards from "../Flashcards/ReviewGeneratedFlashcards";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import UploadFileForm from "./UploadFileForm";
import { useHandleMaterialGeneration } from "@/hooks/useHandleMaterialGeneration";

type UploadFileMenuProps = {
  isFormOpen: boolean;
  actions: Action[];
  label?: string;
  closeForm: () => void;
};

export interface Action {
  id: string;
  title: string;
}

export default function UploadFileMenu({ isFormOpen, closeForm, actions }: UploadFileMenuProps) {
  const {
    file,
    loading,
    reviewing,
    generatedFlashcards,
    selectedActionId,
    setSelectedActionId,
    customPrompt,
    setCustomPrompt,
    handleFileChange,
    handleSubmit,
    handleApprove,
  } = useHandleMaterialGeneration(closeForm);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 p-4 sm:p-12 ${
        isFormOpen ? "animate-backdropBlurIn" : "animate-backdropBlurOut"
      }`}
      onClick={closeForm}
    >
      <div
        className="flex flex-col sm:flex-row w-full h-full gap-4 p-6 bg-surface rounded-xl overflow-y-scroll sm:overflow-y-auto sm:overflow-x-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {reviewing ? (
          <ReviewGeneratedFlashcards
            flashcards={generatedFlashcards as FlashcardDTO[]}
            onCancel={closeForm}
            onApprove={handleApprove}
            loading={loading}
          />
        ) : (
          <UploadFileForm
            handleFileChange={handleFileChange}
            handleSubmit={handleSubmit}
            loading={loading}
            resetForm={closeForm}
            file={file}
            actions={actions}
            selectedActionId={selectedActionId}
            setSelectedActionId={setSelectedActionId}
            closeForm={closeForm}
            setCustomPrompt={setCustomPrompt}
            customPrompt={customPrompt}
          />
        )}
      </div>
    </div>
  );
}
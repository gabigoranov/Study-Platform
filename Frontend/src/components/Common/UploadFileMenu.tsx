import ReviewGeneratedFlashcards from "../Flashcards/ReviewGeneratedFlashcards";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import UploadFileForm from "./UploadFileForm";
import { useHandleMaterialGeneration } from "@/hooks/useHandleMaterialGeneration";
import { AnimatePresence, motion } from "motion/react";

type UploadFileMenuProps = {
  isFormOpen: boolean;
  label?: string;
  closeForm: () => void;
};

export default function UploadFileMenu({
  isFormOpen,
  closeForm,
}: UploadFileMenuProps) {
  const {
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
    handleSubmit,
    handleApprove,
    actions,
  } = useHandleMaterialGeneration(closeForm);

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
            selectedActionId == "generateFlashcards" && (
              <ReviewGeneratedFlashcards
                flashcards={generatedFlashcards as FlashcardDTO[]}
                onCancel={closeForm}
                onApprove={handleApprove}
                loading={loading}
                error={error}
              />
            )
          ) : (
            <UploadFileForm
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
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
        </motion.div>
      </div>
    </div>
  );
}

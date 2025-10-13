import { Upload } from "lucide-react";
import PdfViewer from "./PdfViewer";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Loading from "./Loading";
import { useEffect } from "react";
import ErrorScreen from "./ErrorScreen";
import { Action, SubmitAction } from "@/hooks/useHandleMaterialGeneration";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import ViewFlashcardSkeleton from "../Flashcards/ViewFlashcardSkeleton";
import ViewMindmapSkeleton from "../Mindmaps/ViewMindmapSekeleton";

type UploadFileFormProps = {
  loading: boolean;
  error: boolean;
  resetForm: () => void;
  file: File | undefined;
  actions: Action[];
  selectedActionId: string | undefined;
  setSelectedActionId: (id: string | undefined) => void;
  setCustomPrompt: (text: string | undefined) => void;
  closeForm: () => void;
  handleSubmitFromAction: Record<string, SubmitAction>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customPrompt: string | undefined;
};

export default function UploadFileForm({
  loading,
  error,
  resetForm,
  file,
  actions,
  selectedActionId,
  handleFileChange,
  setSelectedActionId,
  closeForm,
  handleSubmitFromAction,
  customPrompt,
  setCustomPrompt,
}: UploadFileFormProps) {
  const [t] = useTranslation();

  useEffect(() => {
    console.log("action " + selectedActionId);
  });

  // If an error occurs, show the error screen with buttons to retry or cancel
  if (error) {
    return (
      <ErrorScreen
        onRetry={() =>
          handleSubmitFromAction[selectedActionId!](
            selectedActionId!,
            customPrompt!
          )
        }
        onCancel={closeForm}
      />
    );
  }

  //TODO: In the future create the loading skeletons while taking into account the selected action.
  function renderSkeletons(count: number) {
    return Array.from({ length: count }, (_, i) => (
      <ViewFlashcardSkeleton key={i} />
    ));
  }

  if (loading) {
    switch (selectedActionId) {
      case "generateFlashcards":
        return (
          <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-center overflow-x-hidden">
            {renderSkeletons(9)}
          </div>
        );
      case "generateMindmaps":
        return (
          <div className="w-full flex flex-wrap gap-3 p-2 py-4 self-start justify-center overflow-x-hidden">
            <ViewMindmapSkeleton />
          </div>
        )
    }
  }

  return (
    <>
      <div className="w-full sm:max-w-[50%]">
        <PdfViewer file={file} />
      </div>

      <div className="h-full w-full flex flex-col gap-4">
        {/* Upload area */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl h-[600px] cursor-pointer hover:border-gray-600 transition">
          <Upload className="w-10 h-10 text-gray-500 mb-2" />
          <span className="text-gray-500">{t(keys.uploadFileLabel)}</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        {/* Action select */}
        <select
          className="mt-4 p-2 border rounded w-full bg-surface"
          value={selectedActionId}
          onChange={(e) => setSelectedActionId(e.target.value)}
        >
          {actions.map((action) => (
            <option value={action.id} key={action.id}>
              {action.title}
            </option>
          ))}
        </select>
        {/* Custom prompt textarea */}
        <Textarea
          placeholder={t(keys.customPromptPlaceholder)}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />

        {/* Buttons row */}
        <div className="mt-auto flex justify-end gap-2 self-end">
          <Button variant="secondary" onClick={closeForm} className="px-4 py-2">
            {t(keys.closeButton)}
          </Button>
          <Button
            onClick={() =>
              handleSubmitFromAction[selectedActionId!](
                selectedActionId!,
                customPrompt!
              )
            }
            className="px-4 py-2 rounded-xl"
          >
            {t(keys.submitButton)}
          </Button>
        </div>
      </div>
    </>
  );
}

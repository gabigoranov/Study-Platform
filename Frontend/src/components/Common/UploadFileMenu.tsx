import { useAuth } from "@/hooks/useAuth";
import { storageService } from "@/services/storageService";
import { useEffect, useState } from "react";
import PdfViewer from "./PdfViewer";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { BASE_URL } from "@/types/urls";
import { flashcardService } from "@/services/flashcardService";
import { useVariableContext } from "@/context/VariableContext";
import { GeneratedFlashcardDTO } from "@/data/DTOs/GeneratedFlashcardDTO";
import ReviewGeneratedFlashcards from "../Flashcards/ReviewGeneratedFlashcards";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import UploadFileForm from "./UploadFileForm";
import { useQueryClient } from "@tanstack/react-query";
import { Flashcard } from "@/data/Flashcard";

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

export default function UploadFileMenu({
  isFormOpen,
  closeForm,
  actions,
  label,
}: UploadFileMenuProps) {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(true);
  const [file, setFile] = useState<File>();
  const [selectedActionId, setSelectedActionId] = useState<string>();
  const [customPrompt, setCustomPrompt] = useState<string>();
  const { selectedGroupId, setSelectedGroupId } = useVariableContext();
  const [generatedFlashcards, setGeneratedFlashcards] = useState<
    GeneratedFlashcardDTO[]
  >([]);
  const queryClient = useQueryClient();

  //TODO: Extract logic to a separate hook
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setFile(file);
  };

  //TODO: Extract logic to a separate hook
  const handleSubmit = async (actionId: string, customPrompt: string) => {
    if (!file) return;

    setLoading(true);
    try {
      // Upload file to storage

      const downloadUrl = await storageService.uploadFile(
        user?.id as string,
        file,
        "user-files"
      );
      console.log("File uploaded:", downloadUrl);

      // Request flashcard generation from backend using the file download URL
      let response = await fetch(`${BASE_URL}/flashcards/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileDownloadUrl: downloadUrl,
        }),
      });

      // Add the selected material group ID to the generated flashcards
      let json: GeneratedFlashcardDTO[] = await response.json();
      json.forEach((element) => {
        element.materialSubGroupId = selectedGroupId;
      });

      setGeneratedFlashcards(json);

      console.log(json);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      setReviewing(true);
    }
  };

  const handleApprove = async (flashcards: FlashcardDTO[]) => {
    if(!token) 
      return alert("You must be logged in to approve flashcards");

    setReviewing(false);
    setLoading(true);

    //Call api to create approved flashcards

    let result = await flashcardService.createBulk(flashcards, token);
    
    queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId], (old) =>
      old ? [...old, ...result] : [...result]
    );

    setLoading(false);
    closeForm();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 p-4 sm:p-12 ${
        isFormOpen ? "animate-backdropBlurIn" : "animate-backdropBlurOut"
      }`}
      onClick={closeForm}
    >
      <div
        className="flex flex-col sm:flex-row w-full h-full  gap-4p-6 bg-surface rounded-xl overflow-y-scroll sm:overflow-y-auto sm:overflow-x-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {reviewing ? (
          <ReviewGeneratedFlashcards
            flashcards={generatedFlashcards as FlashcardDTO[]}
            onClose={closeForm}
            onApprove={handleApprove}
            onCancel={() => {}}
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

import { useAuth } from "@/hooks/useAuth";
import { storageService } from "@/services/storageService";
import { useState } from "react";
import PdfViewer from "./PdfViewer";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";

type UploadFileFormProps ={
    isFormOpen: boolean;
    actions: Action[];
    label?: string;
    closeForm: () => void;
}

interface Action {
  id: string;
  title: string;
}

export default function UploadFileForm({isFormOpen, closeForm, actions, label} : UploadFileFormProps) {
  const userId = useAuth().user?.id!;

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [selectedActionId, setSelectedActionId] = useState<string>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const publicUrl = await storageService.uploadFile(userId, file, "user-files");
      console.log("File uploaded:", publicUrl);
      // Here you can trigger flashcard generation or any further processing
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      closeForm();
    }

    console.log("Submit clicked with action:", selectedActionId);
    closeForm();
  };

    return (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 ${
            isFormOpen ? "animate-backdropBlurIn" : "animate-backdropBlurOut"
          }`}
          onClick={closeForm}
        >
          <div
            className="flex flex-col sm:flex-row w-full h-full max-h-[90%] gap-4 max-w-[90%] p-6 bg-surface rounded-xl overflow-y-scroll sm:overflow-y-auto scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full sm:max-w-[50%]">
              <PdfViewer file={file}/>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span>Uploading file...</span>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col gap-4">
                {/* Upload area */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl h-[600px] cursor-pointer hover:border-gray-600 transition">
                  <Upload className="w-10 h-10 text-gray-500 mb-2" />
                  <span className="text-gray-500">Click to upload a file</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

                {/* Action select */}
                <select
                  className="mt-4 p-2 border rounded w-full bg-surface"
                  value={selectedActionId}
                  onChange={(e) => setSelectedActionId(e.target.value)}
                >
                  {selectedActionId ? <option>Select Action</option>
                    : actions?.map((action) => (
                        <option
                            value={action.id}
                            key={action.id}
                        >
                            {action.title}
                        </option>
                    ))}
                </select>

                {/* Buttons row */}
                <div className="mt-6 flex justify-end gap-2">
                  <Button onClick={closeForm} className="px-4 py-2">
                    Close
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="px-4 py-2 rounded-xl"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
    )
}
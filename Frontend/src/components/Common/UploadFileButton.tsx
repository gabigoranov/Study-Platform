import { useState } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { storageService } from "@/services/storageService"; // import your Supabase service
import { useAuth } from "@/hooks/useAuth";

export default function UploadFileButton() {
  const userId = useAuth().user?.id!;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [loading, setLoading] = useState(false);

  const openForm = () => {
    setIsVisible(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

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
  };

  const handleSubmit = () => {
    console.log("Submit clicked with action:", selectedAction);
    closeForm();
  };

  return (
    <>
      <Button className="rounded-3xl" variant="outline" onClick={openForm}>
        <Upload className="inline" /> Upload File
      </Button>

      {isVisible && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 ${
            isFormOpen ? "animate-backdropBlurIn" : "animate-backdropBlurOut"
          }`}
          onClick={closeForm}
        >
          <div
            className="flex flex-col w-full max-w-md p-6 bg-surface rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span>Uploading file...</span>
              </div>
            ) : (
              <>
                {/* Upload area */}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl h-40 cursor-pointer hover:border-gray-600 transition">
                  <Upload className="w-10 h-10 text-gray-500 mb-2" />
                  <span className="text-gray-500">Click to upload a file</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>

                {/* Action select */}
                <select
                  className="mt-4 p-2 border rounded w-full bg-surface"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">Select action</option>
                  <option value="generateFlashcards">Generate Flashcards</option>
                  <option value="analyzeFile">Analyze File</option>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

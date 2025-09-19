import { Upload } from "lucide-react";
import PdfViewer from "./PdfViewer";
import { Button } from "../ui/button";
import { Action } from "./UploadFileMenu";
import { Textarea } from "../ui/textarea";

type UploadFileFormProps = {
  loading: boolean;
  resetForm: () => void;
  file: File | undefined;
  actions: Action[];
  selectedActionId: string | undefined;
  setSelectedActionId: (id: string | undefined) => void;
  setCustomPrompt: (text: string | undefined) => void;
  closeForm: () => void;
  handleSubmit: (actionId: string, customPrompt: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customPrompt: string | undefined;
};

export default function UploadFileForm({
  loading,
  resetForm,
  file,
  actions,
  selectedActionId,
  handleFileChange,
  setSelectedActionId,
  closeForm,
  handleSubmit,
  customPrompt,
  setCustomPrompt
}: UploadFileFormProps) {
  return (
    <>
      <div className="w-full sm:max-w-[50%]">
        <PdfViewer file={file} />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 w-full">
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
            {selectedActionId ? (
              <option>Select Action</option>
            ) : (
              actions?.map((action) => (
                <option value={action.id} key={action.id}>
                  {action.title}
                </option>
              ))
            )}
          </select>
          {/* Custom prompt textarea */}
          <Textarea placeholder="Enter a custom prompt for the AI. For example, 'Focus on ...'" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} />  

          {/* Buttons row */}
          <div className="mt-auto flex justify-end gap-2 self-end">
            <Button onClick={closeForm} className="px-4 py-2">
              Close
            </Button>
            <Button
              onClick={() =>handleSubmit(selectedActionId!, customPrompt!)}
              variant="outline"
              className="px-4 py-2 rounded-xl"
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import PdfViewer from "./PdfViewer";
import UploadFileMenu from "./UploadFileMenu";

export default function UploadFileButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsVisible(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };  

  return (
    <>
      <Button className="rounded-3xl" variant="outline" onClick={openForm}>
        <Upload className="inline" /> Upload File
      </Button>

      {isVisible && (
        <UploadFileMenu closeForm={closeForm} isFormOpen={isFormOpen} actions={[
          {
            id: "generateFlashcards",
            title: "Generate Flashcards"
          },
        ]} />
      )}
    </>
  );
}

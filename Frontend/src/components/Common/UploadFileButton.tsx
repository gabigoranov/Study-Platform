import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import UploadFileMenu from "./UploadFileMenu";
import { keys } from "@/types/keys";
import { useTranslation } from "react-i18next";

export default function UploadFileButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [ t ] = useTranslation();

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
        <Upload className="inline" /> 
        {t(keys.uploadMaterialsButton)}
      </Button>

      {isVisible && (
        <UploadFileMenu closeForm={closeForm} isFormOpen={isFormOpen} />
      )}
    </>
  );
}

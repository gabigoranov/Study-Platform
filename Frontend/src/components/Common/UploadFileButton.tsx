import { useState } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import UploadFileMenu from "./UploadFileMenu";
import { keys } from "@/types/keys";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";

export default function UploadFileButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [t] = useTranslation();

  const toggleForm = () => setIsFormOpen((prev) => !prev);

  return (
    <>
      <Button className="rounded-3xl" variant="outline" onClick={toggleForm}>
        <Upload className="inline" />
        {t(keys.uploadMaterialsButton)}
      </Button>

      <AnimatePresence>
        {isFormOpen && (
          <UploadFileMenu
            closeForm={() => setIsFormOpen(false)}
            isFormOpen={isFormOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
}

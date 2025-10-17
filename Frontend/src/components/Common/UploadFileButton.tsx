import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import UploadFileMenu from "./UploadFileMenu";
import { keys } from "@/types/keys";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { useGenerationActions } from "@/hooks/useGenerationActions";
import { useGenerationVariables } from "@/hooks/useGenerationVariables";

type UploadFileButtonProps = {
  defaultActionId: string
}

export default function UploadFileButton({defaultActionId} : UploadFileButtonProps) {
const [isFormOpen, setIsFormOpen] = useState(false);
  const {selectedActionId, setSelectedActionId } = useGenerationActions();
  const generationVars = useGenerationVariables();
  const [t] = useTranslation();

  useEffect(() => {
    setSelectedActionId(defaultActionId);
  }, [defaultActionId]);

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const closeForm = () => {
    // reset form
    console.log("resetting form")

    setSelectedActionId(defaultActionId);
    generationVars.setLoading(false);
    generationVars.setReviewing(false);
    generationVars.setError(false);

    setIsFormOpen(false);
  }

  return (
    <>
      <Button className="rounded-3xl" variant="outline" onClick={toggleForm}>
        <Upload className="inline" />
        {t(keys.uploadMaterialsButton)}
      </Button>

      <AnimatePresence>
        {isFormOpen && (
          <UploadFileMenu
            closeForm={closeForm}
            isFormOpen={isFormOpen}
            selectedActionId={selectedActionId}
            setSelectedActionId={setSelectedActionId}
            {...generationVars}
          />
        )}
      </AnimatePresence>
    </>
  );
}

import { keys } from "@/types/keys";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Edit, Eye, Plus, Trash2, Upload } from "lucide-react";
import { useRef } from "react";

type FlashcardsDashboardHeaderProps = {
    setView: (view: "list" | "create" | "edit") => void;
    handleFileUpload: (files: FileList) => void;
}

export default function FlashcardsDashboardHeader({ setView, handleFileUpload } : FlashcardsDashboardHeaderProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
      <>
        <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-5 mb-4">
            <div className="">
            <h1 className="text-3xl font-bold mb-1 text-left">{t(keys.flashcardsDashboardTitle)}</h1>
            <p className="">{t(keys.flashcardsSubtitle)}</p>
            </div>
            <form className="flex items-center gap-4 h-fit">
            <Input
                className="p-2 px-4 min-w-[300px] rounded-full"
                type="text"
                placeholder={t(keys.searchPlaceholder)}
            />
            <button type="submit">
                <FaMagnifyingGlass className="text-2xl" />
            </button>
            </form>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex gap-2">
            <Button
                className="rounded-3xl"
                variant="outline"
                onClick={() => setView("create")}
            >
                <Plus className="inline" /> {t(keys.createNewButton)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" disabled>
                <Edit className="inline" /> {t(keys.edit)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" disabled>
                <Eye className="inline" /> {t(keys.viewButton)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" disabled>
                <Trash2 className="inline" />
            </Button>
            </div>

            <div className="sm:ml-auto">
            <Button
                className="rounded-3xl"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="inline" /> {t(keys.uploadMaterialsButton)}
            </Button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
            </div>
        </div>
      </>
    )
}
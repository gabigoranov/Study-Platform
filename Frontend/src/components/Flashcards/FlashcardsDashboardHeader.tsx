import { useVariableContext } from "@/context/VariableContext";
import { materialSubGroupsService } from "@/services/materialSubGroupsService";
import { keys } from "@/types/keys";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  Edit,
  Eye,
  Plus,
  TextSelection,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import UploadFileButton from "../Common/UploadFileButton";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useAuth } from "@/hooks/Supabase/useAuth";
import { useMaterialSubGroups } from "@/hooks/MaterialSubGroups/useMaterialSubGroups";
import { FlashcardsDashboardHeaderDropdown } from "./FlashcardsDashboardHeaderDropdown";

type FlashcardsDashboardHeaderProps = {
  setView: (view: "list" | "create" | "edit" | "view" | "revise") => void;
  handleDelete: (id: string) => void;
};

export default function FlashcardsDashboardHeader({
  setView,
  handleDelete,
}: FlashcardsDashboardHeaderProps) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const {
    selectedSubjectId,
    selectedFlashcardId,
    selectedGroupId,
    setSelectedGroupId,
  } = useVariableContext();

  // --- Query: load all groups with their flashcards ---
  const {
    data: groups,
    isLoading,
    error,
  } = useMaterialSubGroups(selectedSubjectId!, token!);

  useEffect(() => {
    if (groups && groups.length > 0 && selectedGroupId === null) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedSubjectId, setSelectedGroupId]);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl text-text font-bold mb-1 text-left">
        {t(keys.flashcardsDashboardTitle)}
      </h1>
      <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-4 mb-4">
        <p className="w-auto text-text-muted">{t(keys.flashcardsSubtitle)}</p>

        <div className="flex items-center gap-2 w-full">
          <FlashcardsDashboardHeaderDropdown
            groups={groups}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
            setView={setView}
          />

          <form className="flex items-center gap-4 h-fit w-full">
            <Input
              className="p-2 px-4 min-w-[10px] max-w-[300px] rounded-full"
              type="text"
              placeholder={t(keys.searchPlaceholder)}
            />
            <button type="submit">
              <FaMagnifyingGlass className="text-2xl" />
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-1 flex-wrap">
          <Button
            className="rounded-3xl"
            variant="outline"
            onClick={() => setView("create")}
          >
            <Plus className="inline" /> {t(keys.createNewButton)}
          </Button>

          <Button
            className="rounded-3xl"
            variant="ghost"
            onClick={() => setView("edit")}
            disabled={selectedFlashcardId === null}
          >
            <Edit className="inline" /> {t(keys.edit)}
          </Button>

          <Button
            className="rounded-3xl"
            variant="ghost"
            onClick={() => setView("view")}
            disabled={selectedFlashcardId === null}
          >
            <Eye className="inline" /> {t(keys.viewButton)}
          </Button>

          <Button
            className="rounded-3xl"
            variant="ghost"
            onClick={() => handleDelete(selectedFlashcardId!)}
            disabled={selectedFlashcardId === null}
          >
            <Trash2 className="inline" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setView("list")}
            className="p-4 rounded-xl"
          >
            {<ChevronLeft className="p-0" />}
          </Button>
        </div>

        <div className="sm:ml-auto flex gap-4">
          <Button
            className="rounded-3xl"
            variant="ghost"
            onClick={() => setView("revise")}
          >
            <TextSelection className="inline" /> {t(keys.reviseButtonLabel)}
          </Button>
          <UploadFileButton defaultActionId="generateFlashcards" />
        </div>
      </div>
    </div>
  );
}

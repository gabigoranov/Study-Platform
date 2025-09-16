import { keys } from "@/types/keys";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "../ui/button";
import { ChevronDown, ChevronLeft, Edit, Eye, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";
import { materialSubGroupsService } from "@/services/materialSubGroupsService";
import UploadFileButton from "../Common/UploadFileButton";


type FlashcardsDashboardHeaderProps = {
    setView: (view: "list" | "create" | "edit" | "view") => void;
    handleDelete: (id: string) => void;
    handleFileUpload: (files: FileList) => void;
    selectedId: string | null;
}

export default function FlashcardsDashboardHeader({ setView, handleFileUpload, handleDelete, selectedId } : FlashcardsDashboardHeaderProps) {
    const { t } = useTranslation();
    const { token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { selectedSubjectId } = useVariableContext();
    const { selectedGroupId, setSelectedGroupId } = useVariableContext();

    // --- Query: load all groups with their flashcards ---
    const { data: groups, isLoading, error } = useQuery({
        queryKey: ["materialSubGroups"],
        queryFn: () => materialSubGroupsService.getAll(token!, `subject/${selectedSubjectId}`, {
            includeMaterials: true
        }),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
      if (groups && groups.length > 0 && selectedGroupId === null) {
        setSelectedGroupId(groups[0].id);
      }
    }, [groups, selectedSubjectId, setSelectedGroupId]);

    return (
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold mb-1 text-left">{t(keys.flashcardsDashboardTitle)}</h1>
        <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-4 mb-4">
            <p className="w-auto">{t(keys.flashcardsSubtitle)}</p>
            
            <div className="flex items-center gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    className={`flex w-fit shadow-none items-center gap-1 bg-surface rounded-xl hover:bg-surface`}
                    >
                    {
                      selectedGroupId ? groups?.find((group) => group.id === selectedGroupId)?.title : t(keys.selectGroup)
                    }
                    <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
  
                <DropdownMenuContent align="start" className="w-32">
                  {groups?.map((group) => (
                      <DropdownMenuItem
                          key={group.id}
                          onClick={() => setSelectedGroupId(group.id)}
                      >
                          {group.title}
                      </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuItem onSelect={() => setView("list")}></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
  
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

            <Button className="rounded-3xl" variant="ghost" onClick={() => setView("edit")} disabled={selectedId === null}>
                <Edit className="inline" /> {t(keys.edit)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" onClick={() => setView("view")} disabled={selectedId === null}>
                <Eye className="inline" /> {t(keys.viewButton)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" onClick={() => handleDelete(selectedId!)} disabled={selectedId === null}>
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

            <div className="sm:ml-auto">
              <UploadFileButton />
            {/* <Button
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
            /> */}
            </div>
        </div>
      </div>
    )
}
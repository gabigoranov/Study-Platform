import { keys } from "@/types/keys";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "../ui/button";
import { ChevronDown, ChevronLeft, Edit, Eye, Plus, TextSelection, Trash2, Upload } from "lucide-react";
import { useEffect, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";
import { materialSubGroupsService } from "@/services/materialSubGroupsService";
import UploadFileButton from "../Common/UploadFileButton";


type MindmapsDashboardHeaderProps = {
    setView: (view: "list" | "create" | "edit" | "view" | "revise") => void;
    handleDelete: (id: string) => void;
    handleFileUpload: (files: FileList) => void;
}

export default function MindmapsDashboardHeader({ setView, handleFileUpload, handleDelete } : MindmapsDashboardHeaderProps) {
    const { t } = useTranslation();
    const { token } = useAuth();
    const { selectedSubjectId, selectedMindmapId } = useVariableContext();
    const { selectedGroupId, setSelectedGroupId } = useVariableContext();

    // --- Query: load all groups with their flashcards ---
    const { data: groups, isLoading, error } = useQuery({
        queryKey: ["materialSubGroups", selectedSubjectId],
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
        <h1 className="text-3xl text-text font-bold mb-1 text-left">{t(keys.mindmapsDashboardHeader)}</h1>
        <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-4 mb-4">
            <p className="w-auto text-text-muted">{t(keys.mindmapsDashboardText)}</p>
            
            <div className="flex items-center gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                    className={`flex w-fit shadow-none items-center gap-1 bg-background-muted text-text rounded-xl hover:bg-surface-muted`}
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

            <Button className="rounded-3xl" variant="ghost" onClick={() => setView("edit")} disabled={selectedMindmapId === null}>
                <Edit className="inline" /> {t(keys.edit)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" onClick={() => setView("view")} disabled={selectedMindmapId === null}>
                <Eye className="inline" /> {t(keys.viewButton)}
            </Button>

            <Button className="rounded-3xl" variant="ghost" onClick={() => handleDelete(selectedMindmapId!)} disabled={selectedMindmapId === null}>
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
              <UploadFileButton defaultActionId="generateMindmaps" />
            </div>
        </div>
      </div>
    )
}
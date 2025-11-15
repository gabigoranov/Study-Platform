import { keys } from "@/types/keys";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "../ui/button";
import { ChevronDown, ChevronLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";
import { subjectService } from "@/services/subjectService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type HomeDashboardHeaderProps = {
    setView: (view: "list" | "create" | "edit" | "view" | "createMaterialGroup" | "editMaterialGroup") => void;
    handleDelete: (id: string) => void;
    selectedId: string | null;
}

export default function HomeDashboardHeader({ setView, handleDelete, selectedId }: HomeDashboardHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold mb-1 text-left">{t(keys.homeDashboardTitle)}</h1>
            <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-4 mb-4">
                <p className="w-auto">{t(keys.homeSubtitle)}</p>
                
                <div className="flex items-center gap-2 w-full">
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

                    <Button className="rounded-3xl" variant="ghost" onClick={() => setView("createMaterialGroup")} disabled={selectedId === null}>
                        <Plus className="inline" /> {t(keys.addGroup)}
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
            </div>
        </div>
    );
}

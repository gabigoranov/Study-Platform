import { keys } from "@/types/keys";
import { t } from "i18next";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MaterialSubGroup } from "@/data/MaterialSubGroup";

type FlashcardsDashboardHeaderDropdownProps = {
  groups: MaterialSubGroup[] | undefined;
  selectedGroupId: any;
  setSelectedGroupId: any;
  setView: (view: "list" | "create" | "edit" | "view" | "revise") => void;
}

export function FlashcardsDashboardHeaderDropdown({
  groups,
  selectedGroupId,
  setSelectedGroupId,
  setView,
}: FlashcardsDashboardHeaderDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex w-fit shadow-none items-center gap-1 bg-background-muted text-text rounded-xl hover:bg-surface-muted`}
        >
          {selectedGroupId
            ? groups?.find((group) => group.id === selectedGroupId)?.title
            : t(keys.selectGroup)}
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
  );
}

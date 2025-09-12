import { IconType } from "react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Subject } from "@/data/Subject";
import { useVariableContext } from "@/context/VariableContext";

export type AppSidebarMenuProps = {
    dropdownTitle: string;
    dropdownTitleIcon: IconType;
    items: Subject[];
}

export default function AppSidebarMenu({dropdownTitle, dropdownTitleIcon: DropdownTitleIcon, items} : AppSidebarMenuProps) {
    const { selectedSubjectId, setSelectedSubjectId } = useVariableContext()

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {selectedSubjectId
                  ? items.find((item) => item.id == selectedSubjectId)?.title
                  : dropdownTitle}
                <DropdownTitleIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {items?.map((item, index) => (
                <DropdownMenuItem key={index} onSelect={() => setSelectedSubjectId(item.id)}>{item?.title}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>  
    )
}
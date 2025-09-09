import { IconType } from "react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

type AppSidebarMenuItem = {
    title: string;
    onSelect: () => void;
}

export type AppSidebarMenuProps = {
    dropdownTitle: string;
    dropdownTitleIcon: IconType;
    items: AppSidebarMenuItem[];
}

export default function AppSidebarMenu({dropdownTitle, dropdownTitleIcon: DropdownTitleIcon, items} : AppSidebarMenuProps) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {dropdownTitle}
                <DropdownTitleIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {items.map((item, index) => (
                <DropdownMenuItem key={index} onSelect={item.onSelect}>{item.title}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>  
    )
}
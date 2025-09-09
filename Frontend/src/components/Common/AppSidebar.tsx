import { ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
    
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import LanguageToggle from "./LanguageToggle";
import { IconType } from "react-icons";
import { Link } from "react-router";

type SidebarItem = {
    title: string;
    url: string;
    icon: IconType;
}

type AppSidebarProps = {
    items: SidebarItem[];
    title: string;
}

export function AppSidebar({items, title} : AppSidebarProps) {
  return (
    <Sidebar className="shadow-none">
      <SidebarHeader>
        <Link to="/">
          <h2 className="text-4xl font-bold">
            Study
            <br />
            Mate
          </h2>
        </Link>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Subject
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Informatics</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Biology</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-widest">{title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LanguageToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

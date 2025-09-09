import { ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
    
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link } from "react-router";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent, { AppSidebarProps } from "./AppSidebarContent";
import AppSidebarMenu from "./AppSidebarMenu";
import AppSidebarHeader from "./AppSidebarHeader";



export function AppSidebar({groups} : AppSidebarProps) {
  return (
    <Sidebar className="shadow-none">
      <AppSidebarHeader />
      <AppSidebarContent groups={groups} />
      <AppSidebarFooter />
    </Sidebar>
  );
}

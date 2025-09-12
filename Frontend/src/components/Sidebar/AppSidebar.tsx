
import {
  Sidebar,
} from "@/components/ui/sidebar";
    
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent, { SidebarGroup } from "./AppSidebarContent";
import AppSidebarHeader from "./AppSidebarHeader";
import { Subject } from "@/data/Subject";

type AppSidebarProps = {
    groups: SidebarGroup[];
    subjects: Subject[] | [];
}


export function AppSidebar({groups, subjects} : AppSidebarProps) {
  return (
    <Sidebar className="shadow-none">
      <AppSidebarHeader items={subjects} />
      <AppSidebarContent groups={groups} />
      <AppSidebarFooter />
    </Sidebar>
  );
}

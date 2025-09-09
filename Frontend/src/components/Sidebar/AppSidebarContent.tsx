import { IconType } from "react-icons/lib/iconBase";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Link } from "react-router";

type SidebarGroupItem = {
    title: string;
    url: string;
    icon: IconType;
}

type SidebarGroup = {
    title: string;
    items: SidebarGroupItem[];
}

export type AppSidebarProps = {
    groups: SidebarGroup[];
}

export default function AppSidebarContent({groups} : AppSidebarProps) {
    return (
      <SidebarContent>
        {groups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="uppercase tracking-widest">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>  
    )
}
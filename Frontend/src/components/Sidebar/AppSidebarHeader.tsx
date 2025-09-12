import { Link } from "react-router";
import { SidebarHeader } from "../ui/sidebar";
import AppSidebarMenu from "./AppSidebarMenu";
import { IconBaseProps } from "react-icons";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Subject } from "@/data/Subject";

type AppSidebarHeaderProps = {
  items: Subject[];
}

export default function AppSidebarHeader({items} : AppSidebarHeaderProps) {
  const { t } = useTranslation();
    return (
      <SidebarHeader>
        <Link to="/">
          <h2 className="text-4xl font-bold">
            Study<br />Mate
          </h2>
        </Link>
        {items.length > 0 && <AppSidebarMenu 
          dropdownTitle={t(keys.selectSubject)}
          dropdownTitleIcon={ChevronDown}
          items={items} />}
      </SidebarHeader>  
    )
}
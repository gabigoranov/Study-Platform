import { Link } from "react-router";
import { SidebarHeader } from "../ui/sidebar";
import AppSidebarMenu from "./AppSidebarMenu";
import { IconBaseProps } from "react-icons";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";

export default function AppSidebarHeader() {
  const { t } = useTranslation();
    return (
      <SidebarHeader>
        <Link to="/">
          <h2 className="text-4xl font-bold">
            Study<br />Mate
          </h2>
        </Link>
        <AppSidebarMenu 
          dropdownTitle={t(keys.selectSubject)}
          dropdownTitleIcon={ChevronDown}
          items={[
            {title: t(keys.subjectInformatics), onSelect: () => {}},
            {title: t(keys.subjectBiology), onSelect: () => {}},
            {title: t(keys.subjectMath), onSelect: () => {}},
          ]} />
      </SidebarHeader>  
    )
}
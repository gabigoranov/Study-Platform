import { Link } from "react-router";
import { SidebarHeader } from "../ui/sidebar";
import AppSidebarMenu from "./AppSidebarMenu";
import { IconBaseProps } from "react-icons";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { Subject } from "@/data/Subject";
import AppLogo from "../Common/AppLogo";
import { toPng } from "html-to-image";

type AppSidebarHeaderProps = {
  items: Subject[];
};

export default function AppSidebarHeader({ items }: AppSidebarHeaderProps) {
  const { t } = useTranslation();
  return (
    <SidebarHeader className="py-4 flex flex-col gap-4">
      <Link to="/">
        <AppLogo />
      </Link>
      {items.length > 0 && (
        <AppSidebarMenu
          dropdownTitle={t(keys.selectSubject)}
          dropdownTitleIcon={ChevronDown}
          items={items}
        />
      )}
    </SidebarHeader>
  );
}

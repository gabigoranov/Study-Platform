import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import ProfileIcon from "./ProfileIcon";

export default function Header() {
  return (
    <header className="w-full h-15 p-4 flex justify-between items-center">
      <SidebarTrigger size="icon" className="[&_svg]:size-6" />
      <ProfileIcon />
    </header>
  );
}

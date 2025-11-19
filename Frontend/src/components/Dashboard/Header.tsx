import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/hooks/Supabase/useAuth";
import ProfileIcon from "./ProfileIcon";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { keys } from "@/types/keys";

export default function Header() {
  return (
    <header className="w-full h-15 p-4 flex justify-between items-center">
      <SidebarTrigger size="icon" className="[&_svg]:size-6" />

      <div className="flex gap-1 justify-end">
        <Link to="/friends">
          <Button variant={"ghost"} size={"lg"} aria-label="friends">
            <User2/> {t(keys.friendsTab)}
          </Button>
        </Link>
        <ProfileIcon />
      </div>
    </header>
  );
}

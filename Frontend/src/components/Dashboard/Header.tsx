import { useTranslation } from "react-i18next";
import LoginComponent from "../Common/LoginComponent";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const {avatarUrl} = useAuth();

    return (
        <header className="w-full h-15 p-4 flex justify-between items-center">
            <SidebarTrigger size="icon" className="[&_svg]:size-6" />
            <div className="">
                <LoginComponent iconProps={{imgUrl: avatarUrl}}/>
            </div>
        </header>   
    )
}
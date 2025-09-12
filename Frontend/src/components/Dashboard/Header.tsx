import { FiMenu, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import LoginComponent from "../Common/LoginComponent";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
    const { t } = useTranslation();
    
    return (
        <header className="w-full h-15 p-4 flex justify-between items-center">
            <SidebarTrigger size="icon" className="[&_svg]:size-6" />
            <div className="">
                <LoginComponent iconProps={{}}/>
            </div>
        </header>   
    )
}
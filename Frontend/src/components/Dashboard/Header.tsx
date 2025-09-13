import { useTranslation } from "react-i18next";
import LoginComponent from "../Common/LoginComponent";
import { SidebarTrigger } from "../ui/sidebar";
import { useCurrentUserImage } from "@/hooks/useCurrentUserImage";

export default function Header() {
    const { t } = useTranslation();
    const profileImage = useCurrentUserImage();
    
    return (
        <header className="w-full h-15 p-4 flex justify-between items-center">
            <SidebarTrigger size="icon" className="[&_svg]:size-6" />
            <div className="">
                <LoginComponent iconProps={{imgUrl: profileImage}}/>
            </div>
        </header>   
    )
}
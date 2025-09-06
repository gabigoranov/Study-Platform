import { FiMenu, FiX } from "react-icons/fi";
import LoginComponent from "./LoginComponent";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";

type HeaderProps = {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
};

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
    const { t } = useTranslation();
    
    return (
        <header className="w-full h-20 p-2 lg:pr-8 flex justify-end gap-4 items-center">
            <LoginComponent iconProps={ {notifications: 3,} }/>
            <button 
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md transition-all duration-200 z-50"
                aria-label={t(keys.toggleMenu)}
            >
                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
        </header>
    )
}
import { FiMenu, FiX } from "react-icons/fi";
import LoginComponent from "./LoginComponent";

type HeaderProps = {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
};

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
    return (
        <header className="w-full h-20 p-2 lg:pr-8 flex justify-end gap-2 items-center">
            <LoginComponent isAuth={false} iconProps={ {notifications: 3,} }/>
            <button 
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md transition-all duration-200 z-50"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
        </header>
    )
}
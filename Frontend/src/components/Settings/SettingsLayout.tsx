import { useState, type ReactNode } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import LanguageToggle from "../Common/LanguageToggle";
import { keys } from "../../types/keys";
import { useTranslation } from "react-i18next";
import { LuSettings } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { LuSunMoon } from "react-icons/lu";
import { Link, Outlet } from "react-router-dom";

export default function SettingsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
      >
        <nav className="pl-4 mt-3">
            <ul>
              <li className="flex g-4 items-center">
                <LuSettings className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="/settings"
                >
                  {t(keys.settingsTitleGeneral)}
                </Link>
              </li>
              <li className="flex g-4 items-center">
                <MdAccountCircle className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="/settings/account"
                >
                  {t(keys.settingsTitleAccount)}
                </Link>
              </li>
              <li className="flex g-4 items-center">
                <LuSunMoon className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="/settings/theme"
                >
                  {t(keys.settingsTitleSecurity)}
                </Link>
              </li>
            </ul>
          </nav>
          <LanguageToggle className="hidden md:block mt-auto ml-auto" />
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-background-dark overflow-auto">
            <Outlet />
        </main>
      </div>
    </div>
  );
}

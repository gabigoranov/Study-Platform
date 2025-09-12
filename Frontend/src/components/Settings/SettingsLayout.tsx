import { useTranslation } from "react-i18next";
import { CircleUser, Settings, SunMoon } from "lucide-react";
import { SidebarProvider } from "../ui/sidebar";
import Header from "../Dashboard/Header";
import { Outlet } from "react-router";
import { AppSidebar } from "../Sidebar/AppSidebar";
import { keys } from "@/types/keys";

export default function SettingsLayout() {
  const { t } = useTranslation();

  const navGroups = [
    {
      title: t(keys.settings),
      items: [
        {
          title: t(keys.settingsTitleGeneral),
          url: "/settings",
          icon: Settings,
        },
        {
          title: t(keys.settingsTitleAccount),
          url: "/settings/account",
          icon: CircleUser,
        },
        {
          title: t(keys.settingsTitleTheme),
          url: "/settings/theme",
          icon: SunMoon,
        },
      ]
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar groups={navGroups} subjects={[]} />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Header />
          <main className="flex-1 p-4 bg-background overflow-auto">
              <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


{/* <Sidebar
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
      </Sidebar> */}
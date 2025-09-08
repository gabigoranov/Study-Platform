import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dropdown from "../Common/Dropdown";
import { FaLaptopCode, FaCalculator, FaFlask } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { PiNoteBlankFill } from "react-icons/pi";
import { MdMap } from "react-icons/md";
import { keys } from "../../types/keys";
import LanguageToggle from "../Common/LanguageToggle";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const options = [
    {
      value: "informatics",
      label: t(keys.subjectInformatics),
      icon: FaLaptopCode,
    },
    { value: "math", label: t(keys.subjectMath), icon: FaCalculator },
    { value: "biology", label: t(keys.subjectBiology), icon: FaFlask },
  ];

  const handleSelect = (value: string) => {
    console.log(`Selected subject: ${value}`);
    // You can add additional logic here based on the selected value
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside>
        <Sidebar isOpen={isSidebarOpen} children={[
          <Dropdown options={options} onSelect={handleSelect} />,
          <nav className="pl-4 mt-6">
            <ul>
              <li className="flex g-4 items-center">
                <AiFillHome className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="#"
                >
                  {t(keys.navHome)}
                </Link>
              </li>
              <li className="flex g-4 items-center">
                <PiNoteBlankFill className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="#"
                >
                  {t(keys.navFlashcards)}
                </Link>
              </li>
              <li className="flex g-4 items-center">
                <MdMap className="text-xl mr-2" />
                <Link
                  className="block text-xl text-text dark:text-text-light hover:font-bold"
                  to="#"
                >
                  {t(keys.navMindmaps)}
                </Link>
              </li>
            </ul>
          </nav>,
          <LanguageToggle className="hidden md:block mt-auto ml-auto" />
        ]} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 p-4 bg-gray-100 dark:bg-background-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

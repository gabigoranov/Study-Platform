import { useState } from "react";
import Header from "./Header";
import { FaLaptopCode, FaCalculator, FaFlask } from "react-icons/fa";
import { keys } from "../../types/keys";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../Common/AppSidebar";
import { Home } from "lucide-react";
import { PiNoteBlankFill } from "react-icons/pi";

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

  const navItems = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Flashcards",
      url: "/flashcards",
      icon: PiNoteBlankFill,
    },
  ];

  const handleSelect = (value: string) => {
    console.log(`Selected subject: ${value}`);
    // You can add additional logic here based on the selected value
  };

  return (
    <SidebarProvider>
      <AppSidebar items={navItems} title="Dashboard" />
      <div className="flex-1 flex flex-col h-screen">
        <Header />

        <main className="flex-1 p-4 bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
    
  );
}

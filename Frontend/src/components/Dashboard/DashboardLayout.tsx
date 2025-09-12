import { useEffect, useState } from "react";
import Header from "./Header";
import { FaLaptopCode, FaCalculator, FaFlask } from "react-icons/fa";
import { keys } from "../../types/keys";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { SidebarProvider } from "../ui/sidebar";
import { Home } from "lucide-react";
import { PiNoteBlankFill } from "react-icons/pi";
import { AppSidebar } from "../Sidebar/AppSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/services/subjectService";
import { useAuth } from "@/hooks/useAuth";
import { useVariableContext } from "@/context/VariableContext";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { selectedSubjectId, setSelectedSubjectId } = useVariableContext();

  // --- Query: load all subjects ---
  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectService.getAll(token!), // return the promise
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (subjects && subjects.length > 0 && selectedSubjectId === null) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId, setSelectedSubjectId]);

  const navGroups = [
    {
      title: t(keys.dashboard),
      items: [
        {
          title: t(keys.navHome),
          url: "/home",
          icon: Home,
        },
        {
          title: t(keys.navFlashcards),
          url: "/flashcards",
          icon: PiNoteBlankFill,
        },
      ]
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar groups={navGroups} subjects={subjects || []} />
      <div className="flex-1 flex flex-col h-screen">
        <Header />

        <main className="flex-1 p-4 bg-background">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
    
  );
}

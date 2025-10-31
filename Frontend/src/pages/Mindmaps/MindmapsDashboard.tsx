import { useRef, useState } from "react";
import FlashcardsDashboardList from "../../components/Flashcards/FlashcardsDashboardList";
import { Flashcard } from "../../data/Flashcard";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { useAuth } from "@/hooks/useAuth";
import FlashcardsForm from "@/components/Flashcards/FlashcardsForm";
import FlashcardsDashboardHeader from "@/components/Flashcards/FlashcardsDashboardHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVariableContext } from "@/context/VariableContext";
import { apiService } from "@/services/apiService";
import ViewFlashcardComponent from "@/components/Flashcards/ViewFlashcardComponent";
import ScrollToTopButton from "@/components/Common/ScrollToTopButton";
import { Route, Routes, useNavigate } from "react-router";
import Loading from "@/components/Common/Loading";
import FlashcardsRevision from "../Flashcards/FlashcardsRevision";
import MindmapsDashboardHeader from "@/components/Mindmaps/MindmapsDashboardHeader";
import CreateMindmapsPage from "./CreateMindmapPage";
import { mindmapPresets } from "@/lib/mindmapPresets";
import CreateMindmapPage from "./CreateMindmapPage";
import { Node, Edge, ReactFlowProvider, ReactFlow } from "@xyflow/react";
import { mindmapsService } from "@/services/mindmapsService";
import MindmapsDashboardList from "@/components/Mindmaps/MindmapsDashboardList";
import ViewMindmapPage from "./ViewMindmapPage";
import { MindmapDTO } from "@/data/DTOs/MindmapDTO";
import { Mindmap } from "@/data/Mindmap";
import MindmapsForm from "@/components/Mindmaps/MindmapsForm";

type View = "list" | "create" | "edit" | "view" | "revise";

export default function MindmapsDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const {
    selectedMindmapId,
    setSelectedMindmapId,
    selectedGroupId,
    selectedSubjectId,
  } = useVariableContext();
  const navigate = useNavigate();


  // --- Query: load all mindmaps ---
  const {
    data: mindmaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mindmaps", selectedGroupId, selectedSubjectId],
    queryFn: () =>
      mindmapsService.getAll(
        token!,
        selectedGroupId ? `group/${selectedGroupId}` : null,
        selectedSubjectId ? { subjectId: selectedSubjectId } : undefined
      ),
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutation: create ---
  const createMutation = useMutation({
    mutationFn: (dto: MindmapDTO) => mindmapsService.create(dto, token!),
    onSuccess: (newMindmap) => {
      queryClient.setQueryData<Mindmap[]>(
        ["mindmaps", selectedGroupId, selectedSubjectId],
        (old) => (old ? [...old, newMindmap] : [newMindmap])
      );
      setView("list");
    },
  });

  // --- Mutation: update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: MindmapDTO }) =>
      mindmapsService.update(id.toString(), dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Mindmap[]>(
        ["mindmaps", selectedGroupId, selectedSubjectId],
        (old) =>
          old ? old.map((fc) => (fc.id === updated.id ? updated : fc)) : []
      );
      setView("list");
    },
  });

  // --- Mutation: delete ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      mindmapsService.delete(token!, {
        ids: id,
      }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Mindmap[]>(
        ["mindmaps", selectedGroupId, selectedSubjectId],
        (old) => (old ? old.filter((fc) => fc.id !== id) : [])
      );

      setSelectedMindmapId(null); // reset selected flashcard after deletion
    },
  });

  // --- Handlers ---
  const handleCreate = (data: MindmapDTO) => {
    console.log("creating");
    createMutation.mutate(data);
  };

  const handleUpdate = (data: MindmapDTO) => {
    if (!selectedMindmapId) return;
    console.log(data);
    updateMutation.mutate({ id: selectedMindmapId, dto: data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      deleteMutation.mutate(id);
    }
  };

  const selectCard = (id: string) => {
    setSelectedMindmapId(id);
    console.log("Selected mindmap:", id);
  };

  const handleFileUpload = (files: FileList) => {
    if (!files) return;
    console.log("Selected files for uploading:", files);
  };

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <MindmapsDashboardHeader
        setView={(view: View) => {
          setView(view);
          navigate(view === "list" ? "/mindmaps" : `/mindmaps/${view}`);
        }}
        handleDelete={handleDelete}
        handleFileUpload={handleFileUpload}
      />
      <div className="flex items-center justify-center w-full h-full flex-1 relative">
        <Routes>
          <Route
            path="/"
            element={
              <MindmapsDashboardList
                mindmaps={mindmaps ?? []}
                onSelect={selectCard}
                selectedId={selectedMindmapId}
                loading={isLoading}
              />
            }
          />
          {/* <Route
            path="create"
            element={
              <ReactFlowProvider>
                <CreateMindmapPage
                  nodes={nodes}
                  edges={edges}
                  handleSave={() => {}}
                />
              </ReactFlowProvider>
            }
          /> */}
          <Route
            path="edit"
            element={
              <MindmapsForm
                model={mindmaps?.find(x => x.id === selectedMindmapId) as MindmapDTO}
                submitLabel={t(keys.updateMindmapButton)}
                onSubmit={(data: MindmapDTO) => {
                  handleUpdate(data);
                  setView("list");
                  navigate("/mindmaps");
                }}
              />
            }
          />
          <Route
            path="view"
            element={
              <div className="w-full h-full flex flex-wrap gap-3 self-center justify-center">
                <ReactFlowProvider>
                  <ViewMindmapPage
                    mindmap={mindmaps?.find((x) => x.id === selectedMindmapId)!}
                    handleSave={handleUpdate}
                  />
                </ReactFlowProvider>
              </div>
            }
          />
        </Routes>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

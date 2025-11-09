import { useState } from "react";
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
import FlashcardsRevision from "./FlashcardsRevision";

type View = "list" | "create" | "edit" | "view" | "revise";
export const flashcardService = apiService<Flashcard, FlashcardDTO, FlashcardDTO>("flashcards");

export default function FlashcardsDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const {selectedFlashcardId, setSelectedFlashcardId, selectedGroupId, selectedSubjectId } = useVariableContext();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const navigate = useNavigate();

  // --- Query: load all flashcards ---
  const { data: flashcards, isLoading, error } = useQuery({
    queryKey: ["flashcards", selectedGroupId, selectedSubjectId],
    queryFn: () => flashcardService.getAll(token!, selectedGroupId ? `group/${selectedGroupId}` : null, selectedSubjectId ? { subjectId: selectedSubjectId} : undefined),
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutation: create ---
  const createMutation = useMutation({
    mutationFn: (dto: FlashcardDTO) => flashcardService.create(dto, token!),
    onSuccess: (newFlashcard) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId, selectedSubjectId], (old) =>
        old ? [...old, newFlashcard] : [newFlashcard]
      );
      setView("list");
    },
  });

  // --- Mutation: update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: FlashcardDTO }) =>
      flashcardService.update(id.toString(), dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId, selectedSubjectId], (old) =>
        old ? old.map((fc) => (fc.id === updated.id ? updated : fc)) : []
      );
      setView("list");
    },
  });

  // --- Mutation: delete ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => flashcardService.delete(token!, {
      ids: id
    }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId, selectedSubjectId], (old) =>
        old ? old.filter((fc) => fc.id !== id) : []
      );

      setSelectedFlashcardId(null); // reset selected flashcard after deletion
    },
  });

  // --- Handlers ---
  const handleCreate = (data: FlashcardDTO) => {
    console.log("creating")
    createMutation.mutate(data);
  };

  const handleUpdate = (data: FlashcardDTO) => {
    if (!selectedFlashcardId) return;
    updateMutation.mutate({ id: selectedFlashcardId, dto: data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      deleteMutation.mutate(id);
      console.log("deleted");
    }
  };

  const selectCard = (id: string) => {
    setSelectedFlashcardId(id);
    console.log("Selected card:", id);
  }

  const handleFileUpload = (files: FileList) => {
    if (!files) return;
    console.log("Selected files for uploading:", files);
  };

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <FlashcardsDashboardHeader
        setView={(view: View) => {
          setView(view);
          navigate(view === "list" ? "/flashcards" : `/flashcards/${view}`)
        }}
        handleDelete={handleDelete}
        handleFileUpload={handleFileUpload}
      />
      <div className="flex items-center justify-center w-full h-full flex-1 relative">
        <Routes>
          <Route path="/" element={
            <FlashcardsDashboardList
              flashcards={flashcards ?? []}
              onSelect={selectCard}
              selectedId={selectedFlashcardId}
              loading={isLoading}
            />
          } />
          <Route path="create" element={
            <FlashcardsForm
              submitLabel={t(keys.createFlashcardButton)}
              onSubmit={(data: FlashcardDTO) => {
                handleCreate(data);

                setView("list");
                navigate("/flashcards");
              }}
            />
          } />
          <Route path="edit" element={
            <FlashcardsForm
              model={flashcards?.find((fc) => fc.id === selectedFlashcardId)}
              submitLabel={t(keys.updateFlashcardButton)}
              onSubmit={(data: FlashcardDTO) => {
                handleUpdate(data);
                setView("list");
                navigate("/flashcards");
              }}
            />
          } />
          <Route path="revise" element={
            <FlashcardsRevision flashcards={flashcards}/>
          } />
          <Route path="view" element={
            <div className="w-full flex flex-wrap gap-3 py-4 self-center justify-center">
              <ViewFlashcardComponent flashcard={flashcards?.find((fc) => fc.id === selectedFlashcardId)} isFlipped={isFlipped} onToggleAnswer={() => setIsFlipped(prev => !prev)} />
            </div>
          } />
        </Routes>
        <ScrollToTopButton />
      </div>
    </div>
  );
}

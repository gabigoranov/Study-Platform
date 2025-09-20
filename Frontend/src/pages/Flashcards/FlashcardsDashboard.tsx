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

type View = "list" | "create" | "edit" | "view";
export const flashcardService = apiService<Flashcard, FlashcardDTO, FlashcardDTO>("flashcards");

export default function FlashcardsDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const {selectedFlashcardId, setSelectedFlashcardId, selectedGroupId } = useVariableContext();

  // --- Query: load all flashcards ---
  const { data: flashcards, isLoading, error } = useQuery({
    queryKey: ["flashcards", selectedGroupId],
    queryFn: () => flashcardService.getAll(token!, selectedGroupId ? `group/${selectedGroupId}` : null),
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutation: create ---
  const createMutation = useMutation({
    mutationFn: (dto: FlashcardDTO) => flashcardService.create(dto, token!),
    onSuccess: (newFlashcard) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId], (old) =>
        old ? [...old, newFlashcard] : [newFlashcard]
      );
      setView("list");
    },
  });

  // --- Mutation: update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: FlashcardDTO }) =>
      flashcardService.update(id.toString(), dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId], (old) =>
        old ? old.map((fc) => (fc.id === updated.id ? updated : fc)) : []
      );
      setEditingId(null);
      setView("list");
    },
  });

  // --- Mutation: delete ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => flashcardService.delete(token!, {
      ids: id
    }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards", selectedGroupId], (old) =>
        old ? old.filter((fc) => fc.id !== id) : []
      );
    },
  });

  // --- Handlers ---
  const handleCreate = (data: FlashcardDTO) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: FlashcardDTO) => {
    if (!selectedFlashcardId) return;
    updateMutation.mutate({ id: selectedFlashcardId, dto: data });
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      deleteMutation.mutate(id);
    }
  };

  const selectCard = (id: number) => {
    setSelectedFlashcardId(id);
    console.log("Selected card:", id);
  }

  const startEdit = (id: number) => {
    setEditingId(id);
    setView("edit");
  };

  const handleFileUpload = (files: FileList) => {
    if (!files) return;
    console.log("Selected files for uploading:", files);
  };

  const renderContent = () => {
    switch (view) {
      case "list":
        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>Error loading flashcards</p>;
        return (
          <FlashcardsDashboardList
            flashcards={flashcards ?? []}
            onSelect={selectCard}
            selectedId={selectedFlashcardId}
          />
        );

      case "create":
        return (
          <FlashcardsForm
            submitLabel={t(keys.createFlashcardButton)}
            onSubmit={handleCreate}
          />
        );

      case "edit":
        const flashcardToEdit = flashcards?.find((fc) => fc.id === selectedFlashcardId);
        if (!flashcardToEdit)
          return (
            <p className="text-center p-4">{t(keys.flashcardNotFound)}</p>
          );
        return (
          <FlashcardsForm
            model={{
              front: flashcardToEdit.front,
              back: flashcardToEdit.back,
              title: flashcardToEdit.title,
              materialSubGroupId: selectedGroupId!,
            }}
            submitLabel={t(keys.updateFlashcardButton)}
            onSubmit={handleUpdate}
          />
        );

      case "view":
        const flashcardToView = flashcards?.find((fc) => fc.id === selectedFlashcardId);
        if (!flashcardToView)
          return (
            <p className="text-center p-4">{t(keys.flashcardNotFound)}</p>
          );

        return (
          <div className="flex justify-center items-center w-full max-w-[1000px] h-full overflow-clip">
            <ViewFlashcardComponent flashcard={flashcardToView} />
          </div>
        );

        default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <FlashcardsDashboardHeader
        setView={(view: "list" | "create" | "edit" | "view") => setView(view)}
        handleDelete={handleDelete}
        selectedId={selectedFlashcardId}
        handleFileUpload={handleFileUpload}
      />
      <div className="flex items-center justify-center w-full h-full flex-1 relative">
        {renderContent()}
      </div>
    </div>
  );
}

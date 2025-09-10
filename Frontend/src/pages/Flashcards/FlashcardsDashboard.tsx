import { useState } from "react";
import { flashcardService } from "../../services/flashcardService";
import FlashcardsDashboardList from "../../components/Flashcards/FlashcardsDashboardList";
import { Flashcard } from "../../data/Flashcard";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { keys } from "../../types/keys";
import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { useAuth } from "@/hooks/useAuth";
import FlashcardsForm from "@/components/Flashcards/FlashcardsForm";
import FlashcardsDashboardHeader from "@/components/Flashcards/FlashcardsDashboardHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type View = "list" | "create" | "edit";

export default function FlashcardsDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // --- Query: load all flashcards ---
  const { data: flashcards, isLoading, error } = useQuery({
    queryKey: ["flashcards"],
    queryFn: () => flashcardService.getAll(token!),
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutation: create ---
  const createMutation = useMutation({
    mutationFn: (dto: FlashcardDTO) => flashcardService.create(dto, token!),
    onSuccess: (newFlashcard) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards"], (old) =>
        old ? [...old, newFlashcard] : [newFlashcard]
      );
      setView("list");
    },
  });

  // --- Mutation: update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: FlashcardDTO }) =>
      flashcardService.update(id, dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards"], (old) =>
        old ? old.map((fc) => (fc.id === updated.id ? updated : fc)) : []
      );
      setEditingId(null);
      setView("list");
    },
  });

  // --- Mutation: delete ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => flashcardService.delete(id, token!),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Flashcard[]>(["flashcards"], (old) =>
        old ? old.filter((fc) => fc.id !== id) : []
      );
    },
  });

  // --- Handlers ---
  const handleCreate = (data: FlashcardDTO) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: FlashcardDTO) => {
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, dto: data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      deleteMutation.mutate(id);
    }
  };

  const startEdit = (id: string) => {
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
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        );

      case "create":
        return (
          <>
            <Button
              variant="outline"
              onClick={() => setView("list")}
              className="mt-4 p-4 rounded-xl"
            >
              {<ChevronLeft className="p-0" />}
            </Button>
            <FlashcardsForm
              submitLabel={t(keys.createFlashcardButton)}
              onSubmit={handleCreate}
            />
          </>
        );

      case "edit":
        const flashcardToEdit = flashcards?.find((fc) => fc.id === editingId);
        if (!flashcardToEdit)
          return (
            <p className="text-center p-4">{t(keys.flashcardNotFound)}</p>
          );
        return (
          <>
            <Button
              variant="outline"
              onClick={() => setView("list")}
              className="mt-4 p-4 rounded-xl"
            >
              {<ChevronLeft className="p-0" />}
            </Button>
            <FlashcardsForm
              model={{
                front: flashcardToEdit.front,
                back: flashcardToEdit.back,
              }}
              submitLabel={t(keys.updateFlashcardButton)}
              onSubmit={handleUpdate}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full pb-8 flex-col gap-4">
      <FlashcardsDashboardHeader
        setView={(view: "list" | "create" | "edit") => setView(view)}
        handleFileUpload={handleFileUpload}
      />
      {renderContent()}
    </div>
  );
}

import { useState, useEffect } from "react";
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

type View = "list" | "create" | "edit";

export default function FlashcardsDashboard() {
  const { t } = useTranslation();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function loadFlashcards() {
      const data = await flashcardService.getAll();
      setFlashcards(data);
    }
    loadFlashcards();
  }, []);

  const handleCreate = async (data: FlashcardDTO ) => {
    // Send to API and save returned data
    const response = await flashcardService.create(data, token!);

    setFlashcards((prev) => [...prev, response]);

    setView("list");
  };

  const handleUpdate = async (data: FlashcardDTO) => {
    if (!editingId) return;
    await flashcardService.update(editingId, data);
    setEditingId(null);
    setView("list");
    // Reload or update flashcards here if you want
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      await flashcardService.delete(id);
      setFlashcards(flashcards.filter(fc => fc.id !== id)); // Update UI immediately
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
        return (
          <FlashcardsDashboardList flashcards={flashcards} onEdit={startEdit} onDelete={handleDelete} />
        );

      case "create":
        return (
          <>
            <Button variant="outline" onClick={() => setView("list")} className="mt-4 p-4 rounded-xl">
              {<ChevronLeft className="p-0" />}
            </Button>
            <FlashcardsForm submitLabel={t(keys.createFlashcardButton)} onSubmit={handleCreate} />
          </>
        );

      case "edit":
        const flashcardToEdit = flashcards.find(fc => fc.id === editingId);
        if (!flashcardToEdit) return <p className="text-center p-4">{t(keys.flashcardNotFound)}</p>;
        return (
          <>
            <Button variant="outline" onClick={() => setView("list")} className="mt-4 p-4 rounded-xl">
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
      <FlashcardsDashboardHeader setView={(view: "list" | "create" | "edit") => setView(view)} handleFileUpload={handleFileUpload}/>
      {renderContent()}
    </div>
  );
};

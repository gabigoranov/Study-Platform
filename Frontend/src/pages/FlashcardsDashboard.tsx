import React, { useState, useEffect, useRef } from "react";
import { flashcardService } from "../services/flashcardService";
import { FlashcardList } from "../components/FlashcardList";
import { FlashcardForm } from "../components/FlashcardForm";
import { Flashcard } from "../data/Flashcard";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "list" | "create" | "edit";

export default function FlashcardsDashboard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function loadFlashcards() {
      const data = await flashcardService.getAll();
      setFlashcards(data);
    }
    loadFlashcards();
  }, []);

  const handleCreate = async (data: Omit<Flashcard, "id">) => {
    const newFlashcard: Flashcard = {
      ...data,
      id: crypto.randomUUID(),
    };
    setFlashcards((fcs) => [...fcs, newFlashcard]);
    await flashcardService.create(data);
    setView("list");
    // Reload or update flashcards here if you want
  };

  const handleUpdate = async (data: Omit<Flashcard, "id">) => {
    if (!editingId) return;
    await flashcardService.update(editingId, data);
    setEditingId(null);
    setView("list");
    // Reload or update flashcards here if you want
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
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
          <FlashcardList flashcards={flashcards} onEdit={startEdit} onDelete={handleDelete} />
        );

      case "create":
        return (
          <>
            <Button variant="secondary" onClick={() => setView("list")} className="mb-4">
              Back to List
            </Button>
            <FlashcardForm submitLabel="Create Flashcard" onSubmit={handleCreate} />
          </>
        );

      case "edit":
        const flashcardToEdit = flashcards.find(fc => fc.id === editingId);
        if (!flashcardToEdit) return <p className="text-center p-4">Flashcard not found.</p>;
        return (
          <>
            <Button variant="secondary" onClick={() => { setView("list"); setEditingId(null); }} className="mb-4">
              Back to List
            </Button>
            <FlashcardForm
              initialData={{
                front: flashcardToEdit.front,
                back: flashcardToEdit.back,
                userId: flashcardToEdit.userId,
              }}
              submitLabel="Update Flashcard"
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
      <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-start gap-5 mb-4">
        <div className="">
          <h1 className="text-3xl font-bold mb-1 text-left">Flashcards</h1>
          <p className="">Generate and revise flashcards with AI.</p>
        </div>
        <form className="flex items-center gap-4 h-fit">
          <Input
            className="p-2 px-4 min-w-[300px] rounded-full"
            type="text"
            placeholder="Search here..."
          />
          <button type="submit">
            <FaMagnifyingGlass className="text-2xl" />
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-2">
          <Button
            className="rounded-3xl"
            variant="outline"
            onClick={() => setView("create")}
          >
            <Plus className="inline" /> Create new
          </Button>

          <Button className="rounded-3xl" variant="ghost" disabled>
            <Edit className="inline" /> Edit
          </Button>

          <Button className="rounded-3xl" variant="ghost" disabled>
            <Eye className="inline" /> View
          </Button>
        </div>

        <div className="sm:ml-auto">
          <Button
            className="rounded-3xl"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="inline" /> Upload Materials
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

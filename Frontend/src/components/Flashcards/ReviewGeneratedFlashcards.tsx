import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import ViewFlashcardComponent from "./ViewFlashcardComponent";
import { Button } from "../ui/button";
import { useState } from "react";
import FlashcardsForm from "./FlashcardsForm";
import Loading from "../Common/Loading";
import ErrorScreen from "../Common/ErrorScreen";

type ReviewGeneratedFlashcardsProps = {
  flashcards: FlashcardDTO[];
  onApprove: (flashcards: FlashcardDTO[]) => void;
  loading?: boolean | false;
  onCancel: () => void;
  error: boolean | false;
};

export default function ReviewGeneratedFlashcards({
  flashcards,
  onApprove,
  loading = false,
  error = false,
  onCancel,
}: ReviewGeneratedFlashcardsProps) {
  // If an error occurs, show the error screen with buttons to retry or cancel
  if (error) {
    console.log("error");
    return <ErrorScreen onRetry={() => onApprove(flashcards)} onCancel={onCancel} />;
  }

  const [data, setData] = useState<FlashcardDTO[]>(
    flashcards ?? [
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0
      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
      {
        title: "Какво е TypeScript?",
        front: "Отговори на въпроса какво е TypeScript?",
        back: "То е ташачно неяо",
        materialSubGroupId: 1,
        difficulty: 0

      },
    ]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function handleEditSubmit(updatedCard: FlashcardDTO) {
    if (editingIndex !== null) {
      const updated = [...data];
      updated[editingIndex] = updatedCard;
      setData(updated);
      setIsEditing(false);
      setEditingIndex(null);
    }
  }

  function handleDelete(card: FlashcardDTO) {
    setData((prev) => prev.filter((c) => c !== card));
  }

  return !isEditing ? (
    <div className="relative flex flex-wrap gap-4 w-fit h-full p-4 justify-center">
      {data.map((card, idx) => (
        <ViewFlashcardComponent
          key={idx}
          flashcard={card}
          onEdit={() => {
            setIsEditing(true);
            setEditingIndex(idx);
          }}
          onDelete={() => handleDelete(card)}
        />
      ))}
      {onApprove && (
        <div className="fixed bottom-[2rem] right-[3rem] sm:bottom-[4rem] sm:right-[4rem] flex gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl shadow-lg"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => onApprove(data)}
            className="px-6 py-3 rounded-xl shadow-lg"
          >
            Approve All
          </Button>
        </div>
      )}
    </div>
  ) : loading ? (
    <Loading isLoading={loading} label={"Submitting Flashcards..."} />
  ) : (
    <FlashcardsForm
      model={editingIndex !== null ? data[editingIndex] : undefined}
      onSubmit={handleEditSubmit}
      submitLabel="Update"
      onCancel={() => {
        setIsEditing(false);
        setEditingIndex(null);
      }}
    />
  );
}

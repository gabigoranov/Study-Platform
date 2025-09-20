import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import ViewFlashcardComponent from "./ViewFlashcardComponent";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import FlashcardsForm from "./FlashcardsForm";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type ReviewGeneratedFlashcardsProps = {
    flashcards: FlashcardDTO[];
    onClose: () => void;
    onApprove: (flashcards: FlashcardDTO[]) => void;
    onCancel: () => void;
}

const editFlashcardFormSchema = z.object({
    title: z.string().min(6).max(30),
    front: z.string().min(6).max(1000),
    back: z.string().min(6).max(1000),
});

export default function ReviewGeneratedFlashcards({
  flashcards,
  onClose,
  onApprove,
  onCancel,
}: ReviewGeneratedFlashcardsProps) {
  const [data, setData] = useState<FlashcardDTO[]>([
    {
      title: "Какво е TypeScript?",
      front: "Отговори на въпроса какво е TypeScript?",
      back: "То е ташачно неяо",
      materialSubGroupId: 1,
    },
    {
      title: "Какво е TypeScript?",
      front: "Отговори на въпроса какво е TypeScript?",
      back: "То е ташачно неяо",
      materialSubGroupId: 1,
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof editFlashcardFormSchema>>({
    resolver: zodResolver(editFlashcardFormSchema),
    defaultValues: {
      title: "",
      front: "",
      back: "",
    },
  });

  useEffect(() => {
    if (editingIndex !== null) {
      const card = data[editingIndex];
      form.reset({
        title: card.title,
        front: card.front,
        back: card.back,
      });
    }
  }, [editingIndex, form, data]);

  function onSubmit(values: z.infer<typeof editFlashcardFormSchema>) {
    if (editingIndex !== null) {
      const updated = [...data];
      updated[editingIndex] = {
        ...updated[editingIndex],
        ...values,
      };
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
        <div className="fixed bottom-[2rem] right-[3rem] sm:bottom-[4rem] sm:right-[4rem] h-fit flex gap-4">
          <Button variant="outline" onClick={onCancel} className="px-6 py-3 rounded-xl shadow-lg hover:bg-primary-dark">
            Cancel
          </Button>
          <Button variant="outline" onClick={() => onApprove(data)} className="px-6 py-3 rounded-xl shadow-lg hover:bg-primary-dark">
            Approve All
          </Button>
        </div>
      )}
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 min-w-[50%] h-fit relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter question here..." {...field} className="h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter answer here..." {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              setIsEditing(false);
              setEditingIndex(null);
            }}
            type="button"
            variant="secondary"
            className="rounded-xl !mt-6"
          >
            Return
          </Button>
          <Button type="submit" variant="outline" className="rounded-xl !mt-6">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
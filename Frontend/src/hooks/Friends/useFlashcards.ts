import { FlashcardDTO } from "@/data/DTOs/FlashcardDTO";
import { Flashcard } from "@/data/Flashcard";
import { flashcardService } from "@/services/flashcardService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type View = "list" | "create" | "edit" | "view" | "revise";

export function useFlashcards(
  selectedGroupId: string,
  selectedSubjectId: string,
  setView: (value: View) => void,
  setSelectedFlashcardId: (value: string | null) => void,
  token: string
) {
  const queryClient = useQueryClient();

  const flashcardsQuery = useQuery({
    queryKey: ["flashcards", selectedGroupId, selectedSubjectId],
    queryFn: () =>
      flashcardService.getAll(
        token!,
        selectedGroupId ? `group/${selectedGroupId}` : null,
        selectedSubjectId ? { subjectId: selectedSubjectId } : undefined
      ),
    staleTime: 1000 * 60 * 5,
  });

  // --- Mutation: create ---
  const createMutation = useMutation({
    mutationFn: (dto: FlashcardDTO) => flashcardService.create(dto, token!),
    onSuccess: (newFlashcard) => {
      queryClient.setQueryData<Flashcard[]>(
        ["flashcards", selectedGroupId, selectedSubjectId],
        (old) => (old ? [...old, newFlashcard] : [newFlashcard])
      );
      setView("list");
    },
  });

  // --- Mutation: update ---
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: FlashcardDTO }) =>
      flashcardService.update(id.toString(), dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Flashcard[]>(
        ["flashcards", selectedGroupId, selectedSubjectId],
        (old) =>
          old ? old.map((fc) => (fc.id === updated.id ? updated : fc)) : []
      );
      setView("list");
    },
  });


    // --- Mutation: delete ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      flashcardService.delete(token!, {
        ids: id,
      }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Flashcard[]>(
        ["flashcards", selectedGroupId, selectedSubjectId],
        (old) => (old ? old.filter((fc) => fc.id !== id) : [])
      );

      setSelectedFlashcardId(null); // reset selected flashcard after deletion
    },
  });

  return {
    ...flashcardsQuery,
    createMutation,
    updateMutation,
    deleteMutation
  };
}

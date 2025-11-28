import { materialSubGroupsService } from "@/services/materialSubGroupsService";
import { useQuery } from "@tanstack/react-query";

export function useMaterialSubGroups(selectedSubjectId: string, token: string) {
  // --- Query: load all groups with their flashcards ---
  const materialSubGroupsQuery = useQuery({
    queryKey: ["materialSubGroups", selectedSubjectId],
    queryFn: () =>
      materialSubGroupsService.getAll(token!, `subject/${selectedSubjectId}`, {
        includeMaterials: false,
      }),
    staleTime: 1000 * 60 * 5,
  });

  return {...materialSubGroupsQuery};
}

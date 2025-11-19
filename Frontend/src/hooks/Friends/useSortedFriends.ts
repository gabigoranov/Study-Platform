import { useMemo } from "react";
import { AppUser } from "@/data/AppUser";

export function useSortedFriends(friends: AppUser[], sortBy: "name" | "score", sortOrder: "asc" | "desc") {
  return useMemo(() => {
    return [...friends].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.displayName.localeCompare(b.displayName)
          : b.displayName.localeCompare(a.displayName);
      } else {
        return sortOrder === "asc" 
          ? a.score - b.score 
          : b.score - a.score;
      }
    });
  }, [friends, sortBy, sortOrder]);
}

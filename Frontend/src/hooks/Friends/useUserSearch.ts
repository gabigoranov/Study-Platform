import { useState, useEffect } from "react";
import { usersService } from "@/services/usersService";
import { AppUser } from "@/data/AppUser";
import { AppUserFriend } from "@/data/AppUserFriend";

export function useUserSearch(token?: string, currentUserId?: string) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppUser[]>([]);

  useEffect(() => {
    if (!query || !token) return;
    (async () => {
      const users = await usersService.getAll(token, null, { input: query });
      setResults(users.filter(u => u.id !== currentUserId));
    })();
  }, [query, token, currentUserId]);

  return { query, setQuery, results };
}
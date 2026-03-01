import { AppUser } from "@/data/AppUser";
import { apiService } from "./apiService";
import { BASE_URL } from "@/types/urls";

export const usersService = {
  ...apiService<AppUser, AppUser, AppUser>("users"),

  search: async (token: string, input: string) => {
    const res = await fetch(`${BASE_URL}/users?input=${encodeURIComponent(input)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to search users");
    return res.json() as Promise<AppUser[]>;
  },
};

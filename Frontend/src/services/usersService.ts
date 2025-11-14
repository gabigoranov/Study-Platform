import { AppUser } from "@/data/AppUser";
import { apiService } from "./apiService";
import { BASE_URL } from "@/types/urls";

type UpdateScoreModel = {
  modifyScoreBy: number;
};

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

  updateScore: async (token: string, modifyScoreBy: number) => {
    const res = await fetch(`${BASE_URL}/users/score`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ modifyScoreBy }),
    });
    if (!res.ok) throw new Error("Failed to update score");
    return res.json() as Promise<AppUser>;
  },
};

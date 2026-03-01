import { AppUser } from "@/data/AppUser";
import { BASE_URL } from "@/types/urls";

export const studentsService = {
  updateScore: async (token: string, modifyScoreBy: number) => {
    const res = await fetch(`${BASE_URL}/students/score`, {
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

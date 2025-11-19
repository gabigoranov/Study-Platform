import { useQuery } from "@tanstack/react-query";
import { friendsService } from "@/services/friendsService";
import { AppUser } from "@/data/AppUser";

export function useFriends(token?: string) {
  return useQuery<AppUser[]>({
    queryKey: ["friends"],
    queryFn: () => friendsService.getAllFriends(token!),
    enabled: !!token,
  });
}
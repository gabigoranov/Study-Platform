import { useQuery } from "@tanstack/react-query";
import { friendsService } from "@/services/friendsService";
import { AppUserFriend } from "@/data/AppUserFriend";

export function useFriendRequests(token?: string) {
  return useQuery<AppUserFriend[]>({
    queryKey: ["friendRequests"],
    queryFn: () => friendsService.getFriendRequests(token!),
    enabled: !!token,
  });
}
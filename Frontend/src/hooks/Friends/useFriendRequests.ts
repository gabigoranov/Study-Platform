import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendsService } from "@/services/friendsService";
import { AppUserFriend } from "@/data/AppUserFriend";

export function useFriendRequests(token?: string) {
  const queryClient = useQueryClient();

  // --- Query: get friend requests ---
  const friendRequestsQuery = useQuery<AppUserFriend[]>({
    queryKey: ["friendRequests"],
    queryFn: () => friendsService.getFriendRequests(token!),
    enabled: !!token,
  });

  // --- Mutation: delete friend request ---
  const deleteRequestMutation = useMutation({
    mutationFn: (id: string) =>
      friendsService.deleteFriend(token!, id),

    onSuccess: (_, id) => {
      // Optimistically update the cached friend requests
      queryClient.setQueryData<AppUserFriend[]>(["friendRequests"], (old) =>
        old ? old.filter((fr) => fr.requesterId !== id && fr.addresseeId !== id) : []
      );
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (id: string) =>
      friendsService.acceptRequest(token!, id),

    onSuccess: (_, id) => {
      // Optimistically update the cached friend requests
      queryClient.setQueryData<AppUserFriend[]>(["friendRequests"], (old) =>
        old ? old.filter((fr) => fr.requesterId !== id && fr.addresseeId !== id) : []
      );

      queryClient.invalidateQueries({queryKey: ["friends"]});
    },
  });

  const sendRequestMutation = useMutation({
    mutationFn: (id: string) =>
      friendsService.sendRequest(token!, id),

    onSuccess: (request: AppUserFriend, id) => {
      // Optimistically update the cached friend requests
      queryClient.setQueryData<AppUserFriend[]>(["friendRequests"], (old) =>
        old ? [request, ...old] : [request]
      );
    },
  });

  return {
    ...friendRequestsQuery,
    deleteRequest: deleteRequestMutation,
    acceptRequest: acceptRequestMutation,
    sendRequest: sendRequestMutation,
  };
}

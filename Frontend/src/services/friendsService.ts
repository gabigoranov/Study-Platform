import { BASE_URL } from "../types/urls";
import {AppUser} from "../data/AppUser";
import {AppUserFriend} from "../data/AppUserFriend";

export const friendsService = {
  getAllFriends: async (token: string): Promise<AppUser[]> => {
    const res = await fetch(`${BASE_URL}/friends`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch friends");
    return res.json();
  },

  getFriendRequests: async (token: string): Promise<AppUserFriend[]> => {
    const res = await fetch(`${BASE_URL}/friends/requests`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch friend requests");
    return res.json();
  },

  sendRequest: async (token: string, addresseeId: string): Promise<AppUserFriend> => {
    const res = await fetch(`${BASE_URL}/friends`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addresseeId }),
    });
    if (!res.ok) throw new Error("Failed to send friend request");
    return res.json();
  },

  acceptRequest: async (token: string, requesterId: string): Promise<AppUserFriend> => {
    const res = await fetch(`${BASE_URL}/friends/${requesterId}/accept`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to accept friend request");
    return res.json();
  },

  rejectRequest: async (token: string, requesterId: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/friends/${requesterId}/reject`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to reject friend request");
  },

  deleteFriend: async (token: string, friendId: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/friends/${friendId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete friend");
  },
};
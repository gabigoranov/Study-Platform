"use client";

import { useAuth } from "@/hooks/useAuth";
import { friendsService } from "@/services/friendsService";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppUser } from "@/data/AppUser";
import { AppUserFriend } from "@/data/AppUserFriend";
import ProfileIcon from "@/components/Dashboard/ProfileIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersService } from "@/services/usersService";
import { string } from "zod";
import UserSearchResultBox from "@/components/Friends/UserSearchResultBox";

export default function FriendsDashboard() {
  const { t } = useTranslation();
  const { token, user } = useAuth(); // get the current user info
  const [activeTab, setActiveTab] = useState<"friends" | "incoming" | "sent">(
    "friends"
  );

  const [friendsSortBy, setFriendsSortBy] = useState<"name" | "score">("score");
  const [friendsSortOrder, setFriendsSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<AppUser[] | null>();

  async function sendFriendRequest(userId: string) {
    let res = await friendsService.sendRequest(token!, userId);
    refetchRequests();
  }

  async function searchUsers(input: string) {
    return await usersService.getAll(token!, null, { input: input });
  }

  // Query for friends
  const {
    data: friends = [],
    isLoading: friendsLoading,
    refetch: refetchFriends,
  } = useQuery<AppUser[]>({
    queryKey: ["friends"],
    queryFn: () => friendsService.getAllFriends(token!),
  });

  // Query for friend requests
  const {
    data: friendRequests = [],
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useQuery<AppUserFriend[]>({
    queryKey: ["friendRequests"],
    queryFn: () => friendsService.getFriendRequests(token!),
  });

  // Filter and sort friends based on search and sort options
  const filteredAndSortedFriends = useMemo(() => {
    // Apply sorting
    let result = friends.sort((a, b) => {
      if (friendsSortBy === "name") {
        return friendsSortOrder === "asc"
          ? a.displayName.localeCompare(b.displayName)
          : b.displayName.localeCompare(a.displayName);
      } else {
        // score
        return friendsSortOrder === "asc"
          ? a.score - b.score
          : b.score - a.score;
      }
    });

    return result;
  }, [friends, friendsSortBy, friendsSortOrder, friendRequests]);

  // Filter incoming friend requests (received requests)
  const incomingRequests = useMemo(() => {
    return friendRequests.filter(
      (req) => req.addresseeId === user?.id && !req.isAccepted
    );
  }, [friendRequests, user]);

  // Filter sent friend requests (requests we sent)
  const sentRequests = useMemo(() => {
    return friendRequests.filter(
      (req) => req.requesterId === user?.id && !req.isAccepted
    );
  }, [friendRequests, user]);

  useEffect(() => {
    if (search.length <= 0 || search == null) return;

    (async () => {
      const result = (await searchUsers(search)).filter(
        (x) => x.id != user?.id
      );

      console.log(result);
      setSearchResult(result);
    })();
  }, [search]);

  return (
    <div className="space-y-6 p-4">
      {(friendsLoading && activeTab === "friends") ||
      (requestsLoading &&
        (activeTab === "incoming" || activeTab === "sent")) ? (
        <p className="text-center py-10">{t(keys.loading)}</p>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t(keys.friends)}</h1>
            <div className="flex space-x-2">
              <Input
                className="border p-2 rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(keys.searchUsers)}
              />
              <UserSearchResultBox
                users={searchResult ?? []}
                isOpen={searchResult != null && searchResult.length > 0}
                handleSendFriendRequest={sendFriendRequest}
              />

              <Button
                variant="secondary"
                onClick={() => {
                  refetchFriends();
                  refetchRequests();
                }}
              >
                {t(keys.refresh)}
              </Button>
              <Button>{t(keys.addFriend)}</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "friends"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("friends")}
              >
                {t(keys.friendsTab)}
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "incoming"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("incoming")}
              >
                {t(keys.incomingRequests)}
                {incomingRequests.length > 0 && (
                  <span className="ml-2 bg-indigo-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sent"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("sent")}
              >
                {t(keys.sentRequests)}
                {sentRequests.length > 0 && (
                  <span className="ml-2 bg-indigo-500 text-white rounded-full px-2 py-0.5 text-xs">
                    {sentRequests.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Tab content */}
          {activeTab === "friends" ? (
            <>
              {/* Friends sorting controls */}
              <div className="flex items-center space-x-4">
                <span>{t(keys.orderBy)}</span>
                <Select
                  value={friendsSortBy}
                  onValueChange={(value) =>
                    setFriendsSortBy(value as "name" | "score")
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t(keys.score)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">{t(keys.score)}</SelectItem>
                    <SelectItem value="name">{t(keys.displayName)}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={friendsSortOrder}
                  onValueChange={(value) =>
                    setFriendsSortOrder(value as "asc" | "desc")
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">{t(keys.descending)}</SelectItem>
                    <SelectItem value="asc">{t(keys.ascending)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredAndSortedFriends.length === 0 ? (
                <p className="text-muted-foreground">
                  {t(keys.noFriendsFound)}
                </p>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>{t(keys.displayName)}</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>{t(keys.score)}</TableHead>
                        <TableHead>{t(keys.actions)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedFriends.map((friend, index) => {
                        const isCurrentUser = friend.id === user?.id;
                        return (
                          <TableRow
                            key={friend.id}
                            className={
                              isCurrentUser
                                ? "bg-success-light/10 font-semibold"
                                : ""
                            }
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {isCurrentUser ? (
                                <ProfileIcon />
                              ) : (
                                <Avatar>
                                  <AvatarFallback>
                                    {friend.displayName[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </TableCell>
                            <TableCell>{friend.displayName}</TableCell>
                            <TableCell>{friend.email}</TableCell>
                            <TableCell>{friend.score}</TableCell>
                            <TableCell className="flex space-x-2">
                              {!isCurrentUser && (
                                <>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to unfriend ${friend.displayName}?`
                                        )
                                      ) {
                                        try {
                                          await friendsService.deleteFriend(
                                            token!,
                                            friend.id
                                          );
                                          refetchFriends(); // Refresh the friends list
                                        } catch (error) {
                                          console.error(
                                            "Failed to delete friend",
                                            error
                                          );
                                        }
                                      }
                                    }}
                                  >
                                    {t(keys.unfriend)}
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </>
          ) : activeTab === "incoming" ? (
            // Incoming friend requests tab
            <>
              {incomingRequests.length === 0 ? (
                <p className="text-muted-foreground">
                  No incoming friend requests
                </p>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>{t(keys.displayName)}</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>{t(keys.actions)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomingRequests.map((req, index) => {
                        // Find the requester user details from friends data
                        const requester = req.requester;

                        return (
                          <TableRow key={req.requesterId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Avatar>
                                <AvatarFallback>
                                  {requester
                                    ? requester.displayName[0].toUpperCase()
                                    : req.requesterId
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              {requester
                                ? requester.displayName
                                : "Unknown User"}
                            </TableCell>
                            <TableCell>
                              {requester ? requester.email : "N/A"}
                            </TableCell>
                            <TableCell>
                              {new Date(req.requestedAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await friendsService.acceptRequest(
                                      token!,
                                      req.requesterId
                                    );
                                    refetchRequests(); // Refresh the requests list
                                    refetchFriends(); // Refresh the friends list
                                  } catch (error) {
                                    console.error(
                                      "Failed to accept friend request",
                                      error
                                    );
                                  }
                                }}
                              >
                                {t(keys.accept)}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await friendsService.deleteFriend(
                                      token!,
                                      req.requesterId
                                    );
                                    refetchRequests(); // Refresh the requests list
                                  } catch (error) {
                                    console.error(
                                      "Failed to reject friend request",
                                      error
                                    );
                                  }
                                }}
                              >
                                {t(keys.reject)}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </>
          ) : (
            // Sent friend requests tab
            <>
              {sentRequests.length === 0 ? (
                <p className="text-muted-foreground">No sent friend requests</p>
              ) : (
                <ScrollArea className="max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Avatar</TableHead>
                        <TableHead>{t(keys.displayName)}</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>{t(keys.actions)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sentRequests.map((req, index) => {
                        // Find the addressee user details from friends data
                        const addressee = req.addressee;

                        return (
                          <TableRow key={req.addresseeId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Avatar>
                                <AvatarFallback>
                                  {addressee
                                    ? addressee.displayName[0].toUpperCase()
                                    : req.addresseeId
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              {addressee
                                ? addressee.displayName
                                : "Unknown User"}
                            </TableCell>
                            <TableCell>
                              {addressee ? addressee.email : "N/A"}
                            </TableCell>
                            <TableCell>
                              {new Date(req.requestedAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="flex space-x-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to cancel the friend request to ${addressee?.displayName || "this user"}?`
                                    )
                                  ) {
                                    try {
                                      await friendsService.deleteFriend(
                                        token!,
                                        req.addresseeId
                                      );
                                      refetchRequests(); // Refresh the requests list
                                    } catch (error) {
                                      console.error(
                                        "Failed to cancel friend request",
                                        error
                                      );
                                    }
                                  }
                                }}
                              >
                                Cancel Request
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

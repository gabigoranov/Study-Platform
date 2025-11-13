"use client";

import { useAuth } from "@/hooks/useAuth";
import { friendsService } from "@/services/friendsService";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FriendsDashboard() {
  const { t } = useTranslation();
  const { token, user } = useAuth(); // get the current user info
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const [search, setSearch] = useState("");
  const [friendsSortBy, setFriendsSortBy] = useState<"name" | "score">("score");
  const [friendsSortOrder, setFriendsSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

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
    let result = friends.filter((f) =>
      f.displayName.toLowerCase().includes(search.toLowerCase())
    );

    // Apply sorting
    result.sort((a, b) => {
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
  }, [friends, search, friendsSortBy, friendsSortOrder]);

  // Filter friend requests (we want to show received requests)
  const receivedRequests = useMemo(() => {
    return friendRequests.filter((req) => req.addresseeId === user?.id);
  }, [friendRequests, user]);

  if (
    (friendsLoading && activeTab === "friends") ||
    (requestsLoading && activeTab === "requests")
  )
    return <p className="text-center py-10">{t(keys.loading)}</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t(keys.friends)}</h1>
        <div className="flex space-x-2">
          <Input
            placeholder={t(keys.searchFriends)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              activeTab === "requests"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            {t(keys.friendRequestsTab)}
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "friends" ? (
        <>
          {/* Friends sorting controls */}
          <div className="flex items-center space-x-4">
            <span>Sort by:</span>
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
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredAndSortedFriends.length === 0 ? (
            <p className="text-muted-foreground">{t(keys.noFriendsFound)}</p>
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
                              {friend.avatarUrl ? (
                                <AvatarImage
                                  src={friend.avatarUrl}
                                  alt={friend.displayName}
                                />
                              ) : (
                                <AvatarFallback>
                                  {friend.displayName[0].toUpperCase()}
                                </AvatarFallback>
                              )}
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
      ) : (
        // Friend requests tab
        <>
          {receivedRequests.length === 0 ? (
            <p className="text-muted-foreground">{t(keys.noFriendRequests)}</p>
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
                  {receivedRequests.map((req, index) => {
                    // Find the requester user details from friends data
                    const requester = friends.find(
                      (f) => f.id === req.requesterId
                    );

                    return (
                      <TableRow key={req.requesterId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Avatar>
                            {requester?.avatarUrl ? (
                              <AvatarImage
                                src={requester.avatarUrl}
                                alt={requester.displayName}
                              />
                            ) : (
                              <AvatarFallback>
                                {requester
                                  ? requester.displayName[0].toUpperCase()
                                  : req.requesterId
                                      .substring(0, 2)
                                      .toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          {requester ? requester.displayName : "Unknown User"}
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
                                await friendsService.rejectRequest(
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
      )}
    </div>
  );
}

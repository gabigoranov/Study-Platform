"use client";

import { useAuth } from "@/hooks/useAuth";
import { friendsService } from "@/services/friendsService";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import ProfileIcon from "@/components/Dashboard/ProfileIcon";

export default function FriendsDashboard() {
  const { t } = useTranslation();
  const { token, user } = useAuth(); // get the current user info
  const [search, setSearch] = useState("");

  const {
    data: friends = [],
    isLoading,
    refetch,
  } = useQuery<AppUser[]>({
    queryKey: ["friends"],
    queryFn: () => friendsService.getAllFriends(token!),
  });

  const filteredFriends = useMemo(() => {
    return friends
      .filter((f) => f.displayName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.score - a.score); // sort by descending score
  }, [friends, search]);

  if (isLoading) return <p className="text-center py-10">Loading friends...</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Friends")}</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" onClick={() => refetch()}>Refresh</Button>
          <Button>Add Friend</Button>
        </div>
      </div>

      {filteredFriends.length === 0 ? (
        <p className="text-muted-foreground">No friends found.</p>
      ) : (
        <ScrollArea className="max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFriends.map((friend, index) => {
                const isCurrentUser = friend.id === user?.id;
                return (
                  <TableRow
                    key={friend.id}
                    className={
                      isCurrentUser ? "bg-success-light/10 font-semibold" : ""
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
                          <Button variant="outline" size="sm">
                            Message
                          </Button>
                          <Button variant="destructive" size="sm">
                            Unfriend
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
    </div>
  );
}

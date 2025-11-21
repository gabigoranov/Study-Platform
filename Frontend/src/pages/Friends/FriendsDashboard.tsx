"use client";

import { useAuth } from "@/hooks/Supabase/useAuth";
import { friendsService } from "@/services/friendsService";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { AppUser } from "@/data/AppUser";
import { AppUserFriend } from "@/data/AppUserFriend";
import { usersService } from "@/services/usersService";
import FriendsTab from "./FriendsTab";
import FriendsDashboardHeader from "@/components/Friends/FriendsDashboardHeader";
import IncomingRequestsTab from "./IncomingRequestsTab";
import SentRequestsTab from "./SentRequestsTab";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import FriendsTabSkeleton from "@/components/Friends/FriendsTabSkeleton";
import { useSortedFriends } from "@/hooks/Friends/useSortedFriends";
import { useUserSearch } from "@/hooks/Friends/useUserSearch";
import { useFriendRequests } from "@/hooks/Friends/useFriendRequests";
import { useFriends } from "@/hooks/Friends/useFriends";

export type FriendsTab = "ranking" | "incoming" | "sent";

export default function FriendsDashboard() {
  const { token, user } = useAuth();
  const { tab } = useParams<{ tab: FriendsTab }>();
  const activeTab: FriendsTab = tab || "ranking";

  const {
    data: friends = [],
    isLoading: friendsLoading,
    refetch: refetchFriends,
  } = useFriends(token!);
  const {
    data: friendRequests = [],
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useFriendRequests(token!);

  const [friendsSortBy, setFriendsSortBy] = useState<"name" | "score">("score");
  const [friendsSortOrder, setFriendsSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  const {
    query: search,
    setQuery: setSearch,
    results: searchResult,
  } = useUserSearch(token!, user?.id);

  const filteredAndSortedFriends = useSortedFriends(
    friends,
    friendsSortBy,
    friendsSortOrder
  );

  const incomingRequests = friendRequests.filter(
    (r) => r.addresseeId === user?.id && !r.isAccepted
  );
  const sentRequests = friendRequests.filter(
    (r) => r.requesterId === user?.id && !r.isAccepted
  );

  if (
    (friendsLoading && activeTab === "ranking") ||
    (requestsLoading && (activeTab === "incoming" || activeTab === "sent"))
  ) {
    return <FriendsTabSkeleton />;
  }

  return (
    <div className="space-y-6 p-4">
      <FriendsDashboardHeader
        search={search}
        setSearch={setSearch}
        searchResult={searchResult}
        refetchFriends={refetchFriends}
        refetchRequests={refetchRequests}
        activeTab={activeTab}
        incomingRequests={incomingRequests}
        sentRequests={sentRequests}
        authToken={token!}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/friends/ranking" replace />} />
        <Route
          path="/ranking"
          element={
            <FriendsTab
              friendsSortBy={friendsSortBy}
              setFriendsSortBy={setFriendsSortBy}
              friendsSortOrder={friendsSortOrder}
              setFriendsSortOrder={setFriendsSortOrder}
              filteredAndSortedFriends={filteredAndSortedFriends}
              currentUserId={user!.id}
              authToken={token!}
            />
          }
        />
        <Route
          path="/incoming"
          element={
            <IncomingRequestsTab
              incomingRequests={incomingRequests}
              authToken={token!}
            />
          }
        />
        <Route
          path="/sent"
          element={
            <SentRequestsTab sentRequests={sentRequests} authToken={token!} />
          }
        />
      </Routes>
    </div>
  );
}

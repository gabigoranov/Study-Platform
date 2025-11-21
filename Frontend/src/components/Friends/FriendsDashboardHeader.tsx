import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { keys } from "@/types/keys";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink, useLocation } from "react-router-dom";
import { FriendsTab } from "@/pages/Friends/FriendsDashboard";
import { AppUserFriend } from "@/data/AppUserFriend";
import { AppUser } from "@/data/AppUser";
import SearchBar from "../Common/SearchBar";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import FriendsSearchDropdown from "./FriendsSearchDropdown";
import { useFriendRequests } from "@/hooks/Friends/useFriendRequests";
import { FriendsDashboardHeaderTabs } from "./FriendsDashboardHeaderTabs";

type FriendsDashboardHeaderProps = {
  search: string;
  setSearch: (value: string) => void;
  searchResult: AppUser[] | undefined;
  refetchFriends: () => void;
  refetchRequests: () => void;
  incomingRequests: AppUserFriend[];
  sentRequests: AppUserFriend[];
  activeTab: FriendsTab;
  authToken: string;
};

export default function FriendsDashboardHeader({
  search,
  setSearch,
  searchResult,
  refetchFriends,
  refetchRequests,
  incomingRequests,
  sentRequests,
  authToken,
}: FriendsDashboardHeaderProps) {
  const location = useLocation();
  const { sendRequest } = useFriendRequests(authToken);

  // Map path to shadcn Tabs value
  const currentTab = location.pathname.includes("/incoming")
    ? "incoming"
    : location.pathname.includes("/sent")
      ? "sent"
      : "friends";

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Tabs */}

      <FriendsDashboardHeaderTabs
        currentTab={currentTab}
        incomingRequests={incomingRequests}
        sentRequests={sentRequests}
      />

      <div className="flex space-x-2">
        <FriendsSearchDropdown
          value={search}
          onChange={setSearch}
          results={searchResult ?? []}
          handleSendFriendRequest={sendRequest.mutate}
        />

        <Button
          variant="secondary"
          onClick={() => {
            refetchFriends();
            refetchRequests();
          }}
        >
          <RefreshCcw />
        </Button>
      </div>
    </div>
  );
}

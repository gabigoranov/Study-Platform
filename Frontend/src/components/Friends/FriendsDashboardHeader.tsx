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

type FriendsDashboardHeaderProps = {
  search: string;
  setSearch: (value: string) => void;
  searchResult: AppUser[] | undefined;
  sendFriendRequest: (userId: string) => void;
  refetchFriends: () => void;
  refetchRequests: () => void;
  incomingRequests: AppUserFriend[];
  sentRequests: AppUserFriend[];
  activeTab: FriendsTab;
};

export default function FriendsDashboardHeader({
  search,
  setSearch,
  searchResult,
  sendFriendRequest,
  refetchFriends,
  refetchRequests,
  incomingRequests,
  sentRequests,
}: FriendsDashboardHeaderProps) {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(
    !!searchResult?.length
  );

  // Map path to shadcn Tabs value
  const currentTab = location.pathname.includes("/incoming")
    ? "incoming"
    : location.pathname.includes("/sent")
      ? "sent"
      : "friends";

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {/* Tabs */}
        <Tabs value={currentTab}>
          <TabsList>
            <TabsTrigger asChild value="friends">
              <NavLink
                to="/friends/ranking"
                className="px-3 py-2 font-medium text-sm border-b-2"
              >
                {t(keys.friendsTab)}
              </NavLink>
            </TabsTrigger>

            <TabsTrigger asChild value="incoming">
              <NavLink
                to="/friends/incoming"
                className="px-3 py-2 font-medium text-sm border-b-2"
              >
                {t(keys.incomingRequests)}
                {incomingRequests.length > 0 && (
                  <span className="ml-2 bg-primary text-text-inverted rounded-full px-2 py-0.5 text-xs">
                    {incomingRequests.length}
                  </span>
                )}
              </NavLink>
            </TabsTrigger>

            <TabsTrigger asChild value="sent">
              <NavLink
                to="/friends/sent"
                className="px-3 py-2 font-medium text-sm border-b-2"
              >
                {t(keys.sentRequests)}
                {sentRequests.length > 0 && (
                  <span className="ml-2 bg-primary text-text-inverted rounded-full px-2 py-0.5 text-xs">
                    {sentRequests.length}
                  </span>
                )}
              </NavLink>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex space-x-2">
          <FriendsSearchDropdown
            value={search}
            onChange={setSearch}
            results={searchResult ?? []}
            handleSendFriendRequest={sendFriendRequest}
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
    </>
  );
}

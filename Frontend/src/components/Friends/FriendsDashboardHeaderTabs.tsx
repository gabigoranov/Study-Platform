import { AppUserFriend } from "@/data/AppUserFriend";
import { keys } from "@/types/keys";
import { t } from "i18next";
import { NavLink } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

type FriendsDashboardHeaderTabsProps = {
  currentTab: "incoming" | "sent" | "friends";
  incomingRequests: AppUserFriend[];
  sentRequests: AppUserFriend[];
}

export function FriendsDashboardHeaderTabs({
  currentTab,
  incomingRequests,
  sentRequests,
}: FriendsDashboardHeaderTabsProps) {
  return (
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
  );
}

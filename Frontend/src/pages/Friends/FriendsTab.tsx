import { friendsService } from "@/services/friendsService";
import { keys } from "@/types/keys";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileIcon from "@/components/Dashboard/ProfileIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "i18next";
import { AppUserFriend } from "@/data/AppUserFriend";
import { AppUser } from "@/data/AppUser";
import FriendsSortingTriggers from "@/components/Friends/FriendsSortingTriggers";
import FriendsListComponent from "@/components/Friends/FriendsListComponent";

type FriendsTabProps = {
  friendsSortBy: "name" | "score";
  setFriendsSortBy: (value: "name" | "score") => void;
  friendsSortOrder: "asc" | "desc";
  setFriendsSortOrder: (value: "asc" | "desc") => void;
  filteredAndSortedFriends: AppUser[];
  currentUserId: string;
  authToken: string;
};

export default function FriendsTab({
  friendsSortBy,
  setFriendsSortBy,
  friendsSortOrder,
  setFriendsSortOrder,
  filteredAndSortedFriends,
  currentUserId,
  authToken,
}: FriendsTabProps) {
  if (filteredAndSortedFriends.length === 0) {
    return <p className="text-muted-foreground">{t(keys.noFriendsFound)}</p>;
  }

  return (
    <>
      {/* Friends sorting controls */}
      <FriendsSortingTriggers
        friendsSortBy={friendsSortBy}
        friendsSortOrder={friendsSortOrder}
        setFriendsSortBy={setFriendsSortBy}
        setFriendsSortOrder={setFriendsSortOrder}
      />

      <ScrollArea className="max-h-[600px]">
        <FriendsListComponent
          authToken={authToken}
          currentUserId={currentUserId}
          filteredAndSortedFriends={filteredAndSortedFriends}
        />
      </ScrollArea>
    </>
  );
}

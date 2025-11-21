import { AppUser } from "@/data/AppUser";
import { friendsService } from "@/services/friendsService";
import { keys } from "@/types/keys";
import { t } from "i18next";
import ProfileIcon from "../Dashboard/ProfileIcon";
import { Button } from "../ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import FriendsListItemComponent from "./FriendsListItemComponent";

type FriendsListComponentProps = {
  authToken: string;
  currentUserId: string;
  filteredAndSortedFriends: AppUser[];
};

export default function FriendsListComponent({
  authToken,
  currentUserId,
  filteredAndSortedFriends,
}: FriendsListComponentProps) {
  return (
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
          const isCurrentUser = friend.id === currentUserId;
          return (
            <FriendsListItemComponent
              authToken={authToken}
              friend={friend}
              index={index}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

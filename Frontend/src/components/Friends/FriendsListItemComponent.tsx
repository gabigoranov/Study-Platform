import { AppUser } from "@/data/AppUser";
import { friendsService } from "@/services/friendsService";
import { keys } from "@/types/keys";
import { t } from "i18next";
import ProfileIcon from "../Dashboard/ProfileIcon";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useFriendRequests } from "@/hooks/Friends/useFriendRequests";
import { useAuth } from "@/hooks/Supabase/useAuth";

type FriendsListItemComponentProps = {
  authToken: string;
  friend: AppUser;
  index: number;
  isCurrentUser: boolean;
};

export default function FriendsListItemComponent({
  authToken,
  friend,
  index,
  isCurrentUser
}: FriendsListItemComponentProps) {
  const {deleteRequest} = useFriendRequests(authToken);

  return (
    <TableRow
      key={friend.id}
      className={isCurrentUser ? "bg-success-light/10 font-semibold" : ""}
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
                    deleteRequest.mutate(friend.id);
                  } catch (error) {
                    console.error("Failed to delete friend", error);
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
}

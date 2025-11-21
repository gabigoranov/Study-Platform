import { AppUserFriend } from "@/data/AppUserFriend";
import { friendsService } from "@/services/friendsService";
import { keys } from "@/types/keys";
import { t } from "i18next";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useFriendRequests } from "@/hooks/Friends/useFriendRequests";
import { useAuth } from "@/hooks/Supabase/useAuth";
import { AppUser } from "@/data/AppUser";

type IncomingRequestItemComponentProps = {
  authToken: string;
  index: number;
  req: AppUserFriend;
  requester: AppUser;
};

export default function IncomingRequestItemComponent({
  authToken,
  index,
  req,
  requester,
}: IncomingRequestItemComponentProps) {
  const { deleteRequest, acceptRequest } = useFriendRequests(authToken);

  return (
    <TableRow key={req.requesterId}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Avatar>
          <AvatarFallback>
            {requester
              ? requester.displayName[0].toUpperCase()
              : req.requesterId.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        {requester ? requester.displayName : "Unknown User"}
      </TableCell>
      <TableCell>{requester ? requester.email : "N/A"}</TableCell>
      <TableCell>{new Date(req.requestedAt).toLocaleString()}</TableCell>
      <TableCell className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={async () => {
            try {
              acceptRequest.mutate(req.requesterId);
            } catch (error) {
              console.error("Failed to accept friend request", error);
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
              deleteRequest.mutate(req.requesterId);
            } catch (error) {
              console.error("Failed to reject friend request", error);
            }
          }}
        >
          {t(keys.reject)}
        </Button>
      </TableCell>
    </TableRow>
  );
}

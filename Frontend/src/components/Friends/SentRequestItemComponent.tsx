import { AppUser } from "@/data/AppUser";
import { AppUserFriend } from "@/data/AppUserFriend";
import { friendsService } from "@/services/friendsService";
import { Button } from "../ui/button";
import { TableRow, TableCell } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useFriendRequests } from "@/hooks/Friends/useFriendRequests";

type SentRequestItemComponentProps = {
  addressee: AppUser;
  authToken: string;
  index: number;
  req: AppUserFriend;
};

export default function SentRequestItemComponent({
  addressee,
  authToken,
  index,
  req,
}: SentRequestItemComponentProps) {
  const { deleteRequest } = useFriendRequests(authToken);

  return (
    <TableRow key={req.addresseeId}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Avatar>
          <AvatarFallback>
            {addressee
              ? addressee.displayName[0].toUpperCase()
              : req.addresseeId.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        {addressee ? addressee.displayName : "Unknown User"}
      </TableCell>
      <TableCell>{addressee ? addressee.email : "N/A"}</TableCell>
      <TableCell>{new Date(req.requestedAt).toLocaleString()}</TableCell>
      <TableCell className="flex space-x-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            if (
              window.confirm(
                `Are you sure you want to cancel the friend request to ${addressee?.displayName || "this user"}?`
              )
            ) {
              try {
                deleteRequest.mutate(req.addresseeId);
              } catch (error) {
                console.error("Failed to cancel friend request", error);
              }
            }
          }}
        >
          Cancel Request
        </Button>
      </TableCell>
    </TableRow>
  );
}

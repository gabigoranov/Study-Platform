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
import { AppUserFriend } from "@/data/AppUserFriend";
import { t } from "i18next";

type SentRequestsTabProps = {
  refetchFriends: () => void;
  refetchRequests: () => void;
  sentRequests: AppUserFriend[];
  authToken: string;
};

export default function sentRequestsTab({
  refetchFriends,
  refetchRequests,
  sentRequests,
  authToken,
} : SentRequestsTabProps) {
  return (
    <>
      {sentRequests.length === 0 ? (
        <p className="text-muted-foreground">No sent friend requests</p>
      ) : (
        <ScrollArea className="max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>{t(keys.displayName)}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>{t(keys.actions)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentRequests.map((req, index) => {
                // Find the addressee user details from friends data
                const addressee = req.addressee;

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
                    <TableCell>
                      {new Date(req.requestedAt).toLocaleString()}
                    </TableCell>
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
                              await friendsService.deleteFriend(
                                authToken,
                                req.addresseeId
                              );
                              refetchRequests(); // Refresh the requests list
                            } catch (error) {
                              console.error(
                                "Failed to cancel friend request",
                                error
                              );
                            }
                          }
                        }}
                      >
                        Cancel Request
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}

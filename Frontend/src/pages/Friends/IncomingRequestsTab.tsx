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

type IncomingRequestsTabProps = {
  refetchFriends: () => void;
  refetchRequests: () => void;
  incomingRequests: AppUserFriend[];
  authToken: string;
};

export default function IncomingRequestsTab({
  refetchFriends,
  refetchRequests,
  incomingRequests,
  authToken,
}: IncomingRequestsTabProps) {
  return (
    <>
      {incomingRequests.length === 0 ? (
        <p className="text-muted-foreground">No incoming friend requests</p>
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
              {incomingRequests.map((req, index) => {
                // Find the requester user details from friends data
                const requester = req.requester;

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
                    <TableCell>
                      {new Date(req.requestedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={async () => {
                          try {
                            await friendsService.acceptRequest(
                              authToken,
                              req.requesterId
                            );
                            refetchRequests(); // Refresh the requests list
                            refetchFriends(); // Refresh the friends list
                          } catch (error) {
                            console.error(
                              "Failed to accept friend request",
                              error
                            );
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
                            await friendsService.deleteFriend(
                              authToken,
                              req.requesterId
                            );
                            refetchRequests(); // Refresh the requests list
                          } catch (error) {
                            console.error(
                              "Failed to reject friend request",
                              error
                            );
                          }
                        }}
                      >
                        {t(keys.reject)}
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

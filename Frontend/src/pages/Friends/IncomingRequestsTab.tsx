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
import IncomingRequestItemComponent from "@/components/Friends/IncomingRequestsItemComponent";

type IncomingRequestsTabProps = {
  incomingRequests: AppUserFriend[];
  authToken: string;
};

export default function IncomingRequestsTab({
  incomingRequests,
  authToken,
}: IncomingRequestsTabProps) {
  if (incomingRequests.length === 0) {
    return <p className="text-muted-foreground">No incoming friend requests</p>;
  }

  return (
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
              <IncomingRequestItemComponent
                authToken={authToken}
                index={index}
                req={req}
                requester={requester}
              />
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

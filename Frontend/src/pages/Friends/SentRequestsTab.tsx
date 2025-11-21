import { keys } from "@/types/keys";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppUserFriend } from "@/data/AppUserFriend";
import { t } from "i18next";
import SentRequestItemComponent from "@/components/Friends/SentRequestItemComponent";

type SentRequestsTabProps = {
  sentRequests: AppUserFriend[];
  authToken: string;
};

export default function sentRequestsTab({
  sentRequests,
  authToken,
}: SentRequestsTabProps) {
  if (sentRequests.length === 0) {
    return <p className="text-muted-foreground">No sent friend requests</p>;
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
          {sentRequests.map((req, index) => {
            // Find the addressee user details from friends data
            const addressee = req.addressee;

            return (
              <SentRequestItemComponent
                addressee={addressee}
                authToken={authToken}
                index={index}
                req={req}
              />
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

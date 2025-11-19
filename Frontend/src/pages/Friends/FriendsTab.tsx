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

type FriendsTabProps = {
  friendsSortBy: "name" | "score";
  setFriendsSortBy: (value: "name" | "score") => void;
  friendsSortOrder: "asc" | "desc";
  setFriendsSortOrder: (value: "asc" | "desc") => void;
  filteredAndSortedFriends: AppUser[];
  currentUserId: string;
  authToken: string;
  refetchFriends: () => void;
};

export default function FriendsTab({
  friendsSortBy,
  setFriendsSortBy,
  friendsSortOrder,
  setFriendsSortOrder,
  filteredAndSortedFriends,
  currentUserId,
  authToken,
  refetchFriends,
}: FriendsTabProps) {
  return (
    <>
      {/* Friends sorting controls */}
      <div className="flex items-center space-x-4">
        <span>{t(keys.orderBy)}</span>
        <Select
          value={friendsSortBy}
          onValueChange={(value) => setFriendsSortBy(value as "name" | "score")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t(keys.score)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">{t(keys.score)}</SelectItem>
            <SelectItem value="name">{t(keys.displayName)}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={friendsSortOrder}
          onValueChange={(value) =>
            setFriendsSortOrder(value as "asc" | "desc")
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">{t(keys.descending)}</SelectItem>
            <SelectItem value="asc">{t(keys.ascending)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedFriends.length === 0 ? (
        <p className="text-muted-foreground">{t(keys.noFriendsFound)}</p>
      ) : (
        <ScrollArea className="max-h-[600px]">
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
                  <TableRow
                    key={friend.id}
                    className={
                      isCurrentUser ? "bg-success-light/10 font-semibold" : ""
                    }
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
                                  await friendsService.deleteFriend(
                                    authToken,
                                    friend.id
                                  );
                                  refetchFriends(); // Refresh the friends list
                                } catch (error) {
                                  console.error(
                                    "Failed to delete friend",
                                    error
                                  );
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
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}

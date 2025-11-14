import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppUser } from "@/data/AppUser";
import { usersService } from "@/services/usersService";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { UserPlus2 } from "lucide-react";

type UserSearchResultBoxProps = {
  users: AppUser[];
  isOpen: boolean;
  handleSendFriendRequest: (addresseeId: string) => void;
};

export default function UserSearchResultBox({
  users,
  isOpen,
  handleSendFriendRequest
}: UserSearchResultBoxProps) {
  return (
    <Popover open={isOpen}>
      <PopoverTrigger />

      <PopoverContent className="w-auto p-0">
        <div className="max-h-60 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex w-full items-center gap-3 px-4 py-2 hover:bg-surface-muted rounded-lg text-left"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>{u.displayName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{u.displayName}</span>

              <Button variant={"ghost"} size={"icon"} className="p-4" onClick={() => handleSendFriendRequest(u.id)}>
                <UserPlus2 />
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

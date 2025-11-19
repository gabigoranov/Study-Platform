"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { AppUser } from "@/data/AppUser";
import { useRef, useEffect, useState } from "react";
import SearchBar from "../Common/SearchBar";

type FriendsSearchDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  results: AppUser[];
  handleSendFriendRequest: (id: string) => void;
};

export default function FriendsSearchDropdown({
  value,
  onChange,
  results,
  handleSendFriendRequest,
}: FriendsSearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show dropdown only if there are results and the input is not empty
  useEffect(() => {
    setOpen(value.length > 0 && results.length > 0);
  }, [value, results]);

  // Click-away listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <Popover open={open}>
        <PopoverTrigger asChild>
          <div>
            <SearchBar value={value} onChange={onChange} />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className="w-full max-h-60 overflow-y-auto p-0 mt-1 shadow-lg border rounded-md bg-background"
        >
          {results.map((user) => (
            <div
              key={user.id}
              className="flex w-full items-center gap-3 px-4 py-2 hover:bg-surface-muted rounded-lg text-left"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>{user.displayName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="flex-1">{user.displayName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
                onClick={() => handleSendFriendRequest(user.id)}
              >
                <UserPlus2 />
              </Button>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

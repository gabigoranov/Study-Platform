import { ReactNode } from "react";
import { t } from "i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { keys } from "@/types/keys";

type FriendsSortingTriggersProps = {
  friendsSortBy: "name" | "score";
  setFriendsSortBy: (value: "name" | "score") => void;
  friendsSortOrder: "asc" | "desc";
  setFriendsSortOrder: (value: "asc" | "desc") => void;
};

export default function FriendsSortingTriggers({
  friendsSortBy,
  setFriendsSortBy,
  friendsSortOrder,
  setFriendsSortOrder,
}: FriendsSortingTriggersProps) {
  return (
    <div className="flex gap-2 items-center">
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
        onValueChange={(value) => setFriendsSortOrder(value as "asc" | "desc")}
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
  );
}

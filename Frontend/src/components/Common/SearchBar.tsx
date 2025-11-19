"use client";

import { Input } from "@/components/ui/input";
import { t } from "i18next";
import { keys } from "@/types/keys";
import { LucideSearch } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <LucideSearch className="w-4 h-4 text-text-muted" />
      </div>
      <Input
        className="pl-10 pr-4 py-2 w-full rounded-md border-border focus:border-primary focus:ring-1 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t(keys.searchUsers)}
      />
    </div>
  );
}

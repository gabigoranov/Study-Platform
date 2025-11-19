"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FriendsTabSkeleton() {
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* Sorting controls skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-28 h-10 rounded" />
        <Skeleton className="w-36 h-10 rounded" />
        <Skeleton className="w-36 h-10 rounded" />
      </div>

      {/* Table skeleton */}
      <ScrollArea className="max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="w-8 h-5 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-40 h-6 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-48 h-6 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-6 rounded" />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-3">
                    <Skeleton className="w-24 h-8 rounded" />
                    <Skeleton className="w-24 h-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

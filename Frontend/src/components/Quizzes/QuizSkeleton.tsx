import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizSkeleton() {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4">
      {/* Progress bar skeleton */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm mb-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="w-full h-2.5 rounded-full" />
      </div>

      {/* Quiz content skeleton */}
      <Card className="flex-1 flex flex-col shadow-xl border-0 bg-gradient-to-br from-surface to-surface-muted rounded-xl overflow-hidden">
        <CardContent className="flex-1 p-6 flex flex-col relative">
          {/* Question header skeleton */}
          <div className="mb-8">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-8 w-3/4 max-w-2xl" />
              <Skeleton className="h-8 w-2/3 max-w-xl" />
            </div>
          </div>

          {/* Answer options skeleton */}
          <div className="grid gap-4 flex-1 max-w-2xl mx-auto w-full">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="p-5 rounded-xl border-2 border-muted bg-background"
              >
                <div className="flex items-center w-full">
                  <Skeleton className="h-8 w-8 rounded-full mr-4 flex-shrink-0" />
                  <Skeleton className="h-6 flex-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Submit button skeleton */}
          <div className="mt-8 flex justify-center">
            <Skeleton className="h-14 w-40 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import FormList from "@/components/FormList";
import { useAppSelector } from "@/lib/redux/hooks";

export default function DashboardPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  if (!currentWorkspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
          <h3 className="text-base font-semibold tracking-tight">
            No workspace selected
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Select or create a workspace to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {currentWorkspace.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Forms overview and activity
        </p>
      </div>

      {/* Forms Grid */}
      <FormList />
    </div>
  );
}

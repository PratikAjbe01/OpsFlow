"use client";

import MyFormsList from "@/components/MyFormList";
import { useAppSelector } from "@/lib/redux/hooks";

export default function MyFormsPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          My Forms
        </h1>
        <p className="mt-1 text-sm font-mono text-muted-foreground">
          Showing forms created by you in{" "}
          <span className="text-foreground">
            {currentWorkspace?.name}
          </span>
        </p>
      </div>

      {/* Forms Grid */}
      <MyFormsList />
    </div>
  );
}

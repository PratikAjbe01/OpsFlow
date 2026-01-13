"use client";

import FormList from "@/components/FormList";
import { useAppSelector } from "@/lib/redux/hooks";

export default function DashboardPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  // If no workspace is selected, show a prompt
  if (!currentWorkspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No Workspace Selected
          </h3>
          <p className="text-sm text-gray-500">
            Please select or create a workspace to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
        {currentWorkspace.name} Overview
      </h2>

      {/* Load the Form List here */}
      <FormList />
    </div>
  );
}

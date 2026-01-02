"use client";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashBoardHeader";
import { useAppSelector } from "@/lib/redux/hooks";

export default function DashboardLayout() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {currentWorkspace ? (
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {currentWorkspace.name} Overview
              </h2>

              {/* Stats Grid */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Total Forms
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Total Submissions
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Plan
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    Free
                  </dd>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No Workspace Selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select or create a workspace to continue.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

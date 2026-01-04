'use client';

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashBoardHeader';
import FormList from '@/components/FormList'; // <--- Import
import { useAppSelector } from '@/lib/redux/hooks';

export default function DashboardLayout() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8">
          {currentWorkspace ? (
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {currentWorkspace.name} Overview
              </h2>
              
              {/* Load the Form List here */}
              <FormList />
              
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">No Workspace Selected</h3>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
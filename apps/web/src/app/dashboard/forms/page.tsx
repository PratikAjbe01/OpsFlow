'use client';

import MyFormsList from '@/components/MyFormList';
import { useAppSelector } from '@/lib/redux/hooks';

export default function MyFormsPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
           My Forms
        </h2>
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
         Showing only forms created by you in {currentWorkspace?.name}.
      </p>

      {/* Render the filtered list */}
      <MyFormsList />
    </div>
  );
}
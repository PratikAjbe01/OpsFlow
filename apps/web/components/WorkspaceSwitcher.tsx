'use client';

import { useEffect } from 'react';
import { useGetWorkspacesQuery, useCreateWorkspaceMutation } from '@/lib/redux/api/workspaceApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setActiveWorkspace } from '@/lib/redux/slices/workspaceSlice';

export default function WorkspaceSwitcher() {
  const dispatch = useAppDispatch();
  const { data: workspaces, isLoading } = useGetWorkspacesQuery();
  const currentWorkspace = useAppSelector((state) => state.workspace.currentWorkspace);
  
  // Creation State
  const [createWorkspace, { isLoading: isCreating }] = useCreateWorkspaceMutation();

  // Auto-select the first workspace if none is active
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      dispatch(setActiveWorkspace({
        id: workspaces[0]._id,
        name: workspaces[0].name,
        slug: workspaces[0].slug
      }));
    }
  }, [workspaces, currentWorkspace, dispatch]);

  const handleCreate = async () => {
    const name = prompt('Enter Workspace Name:');
    if (name) {
      await createWorkspace({ name }).unwrap();
    }
  };

  if (isLoading) return <div>Loading workspaces...</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Active Workspace</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={currentWorkspace?.id || ''}
            onChange={(e) => {
              const selected = workspaces?.find(w => w._id === e.target.value);
              if (selected) {
                dispatch(setActiveWorkspace({
                    id: selected._id,
                    name: selected.name,
                    slug: selected.slug
                }));
              }
            }}
          >
            {workspaces?.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          {isCreating ? 'Creating...' : '+ New Workspace'}
        </button>
      </div>
    </div>
  );
}
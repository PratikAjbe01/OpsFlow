"use client";

import { useState, useEffect } from "react";
import {
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
} from "@/lib/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveWorkspace } from "@/lib/redux/slices/workspaceSlice";
import { ChevronDown, PlusCircle, Check } from "lucide-react";

export default function DashboardHeader() {
  const dispatch = useAppDispatch();

  // 1. Fetch
  const { data, isLoading } = useGetWorkspacesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // 🔍 DEBUGGING: Check your browser console to see exactly what 'data' holds
  console.log("Redux Workspaces Data:", data);

  // 2. FLEXIBLE EXTRACTION (The Fix)
  // This works if 'data' is the array [ ... ] OR if 'data' is { workspaces: [ ... ] }
  const workspacesList = Array.isArray(data)
    ? data
    : Array.isArray(data?.workspaces)
    ? data.workspaces
    : [];

  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const [createWorkspace] = useCreateWorkspaceMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 3. Auto-select logic
  useEffect(() => {
    if (isLoading) return;

    if (workspacesList.length > 0) {
      const isValid = workspacesList.find(
        (w: any) => w._id === currentWorkspace?._id
      );

      if (!currentWorkspace || !isValid) {
        dispatch(setActiveWorkspace(workspacesList[0]));
      }
    } else {
      if (currentWorkspace) {
        dispatch(setActiveWorkspace(null));
      }
    }
  }, [workspacesList, currentWorkspace, isLoading, dispatch]);

  const handleCreate = async () => {
    const name = prompt("New Workspace Name:");
    if (!name) return;

    setIsCreating(true);
    try {
      const res = await createWorkspace({ name }).unwrap();
      dispatch(setActiveWorkspace(res.workspace));
      setIsOpen(false);
    } catch (err) {
      alert("Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <span className="h-6 w-6 flex items-center justify-center rounded bg-blue-600 text-xs text-white">
            {currentWorkspace?.name?.charAt(0) || "?"}
          </span>
          <span>{currentWorkspace?.name || "Select Workspace"}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                My Workspaces
              </p>

              {workspacesList.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-400 italic">
                  No workspaces found
                </p>
              )}

              {workspacesList.map((w: any) => (
                <button
                  key={w._id}
                  onClick={() => {
                    dispatch(setActiveWorkspace(w));
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <span className="truncate">{w.name}</span>
                  {currentWorkspace?._id === w._id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex w-full items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-50">
                <PlusCircle className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Create New Workspace"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
    </header>
  );
}

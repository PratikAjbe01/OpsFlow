"use client";

import { useState, useEffect } from "react";
import {
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
} from "@/lib/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setActiveWorkspace } from "@/lib/redux/slices/workspaceSlice";
import {
  ChevronDown,
  PlusCircle,
  Check,
  Menu,
} from "lucide-react";

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetWorkspacesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const workspacesList = Array.isArray(data)
    ? data
    : Array.isArray(data?.workspaces)
    ? data.workspaces
    : [];

  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const [createWorkspace] = useCreateWorkspaceMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (workspacesList.length > 0) {
      const isValid = workspacesList.find(
        (w: any) => w._id === currentWorkspace?._id
      );

      if (!currentWorkspace || !isValid) {
        dispatch(setActiveWorkspace(workspacesList[0]));
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
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/70 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-md p-2 hover:bg-secondary">
          <Menu className="h-5 w-5" />
        </button>

        {/* Workspace switcher */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-sidebar-primary text-xs text-white">
              {currentWorkspace?.name?.charAt(0) || "?"}
            </span>
            <span className="max-w-[140px] truncate">
              {currentWorkspace?.name || "Select workspace"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 w-60 rounded-md border border-border bg-card shadow-lg">
              <div className="py-1">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  Workspaces
                </p>

                {workspacesList.map((w: any) => (
                  <button
                    key={w._id}
                    onClick={() => {
                      dispatch(setActiveWorkspace(w));
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-secondary">
                    <span className="truncate">{w.name}</span>
                    {currentWorkspace?._id === w._id && (
                      <Check className="h-4 w-4 text-sidebar-primary" />
                    )}
                  </button>
                ))}

                <div className="my-1 border-t border-border" />

                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex w-full items-center px-4 py-2 text-sm text-sidebar-primary hover:bg-secondary">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isCreating ? "Creating…" : "Create workspace"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-8 w-8 rounded-full bg-secondary" />
    </header>
  );
}

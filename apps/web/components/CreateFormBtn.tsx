"use client";

import { useCreateFormMutation } from "@/lib/redux/api/formApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateFormBtn() {
  const router = useRouter();
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const [createForm, { isLoading }] = useCreateFormMutation();

  const handleCreate = async () => {
    if (!currentWorkspace) return;

    const name = prompt("Form Name:");
    if (!name) return;

    try {
      const form = await createForm({
        name,
        workspaceId: currentWorkspace._id,
      }).unwrap();

      router.push(`/builder/${form._id}`);
    } catch {
      alert("Failed to create form");
    }
  };

  if (!currentWorkspace) return null;

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className="group flex w-full flex-col items-center justify-center gap-3 text-sidebar-primary focus:outline-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-primary/15 transition group-hover:bg-sidebar-primary/25">
        <Plus className="h-6 w-6" />
      </div>

      <span className="text-sm font-semibold">
        {isLoading ? "Creating…" : "Create New Form"}
      </span>
    </button>
  );
}

"use client";

import {
  useGetFormsQuery,
  useDeleteFormMutation,
} from "@/lib/redux/api/formApi";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { Calendar, BarChart3, Trash2 } from "lucide-react";
import CreateFormBtn from "./CreateFormBtn";
import { cn } from "@/lib/utils";

export default function FormList() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  const { data: forms, isLoading } = useGetFormsQuery(
    currentWorkspace?._id || "",
    { skip: !currentWorkspace }
  );

  const [deleteForm] = useDeleteFormMutation();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (confirm("Delete this form permanently?")) {
      await deleteForm(id);
    }
  };

  if (!currentWorkspace) return null;

  if (isLoading)
    return (
      <div className="mt-8 text-sm text-muted-foreground">Loading forms…</div>
    );

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border-2 border-dashed border-sidebar-primary/40 bg-sidebar-primary/5 p-8 flex items-center justify-center transition hover:bg-sidebar-primary/10 hover:border-sidebar-primary">
        <CreateFormBtn />
      </div>

      {forms?.map((form) => (
        <Link
          key={form._id}
          href={`/builder/${form._id}`}
          className="group relative rounded-xl border border-border bg-card/50 backdrop-blur p-5 transition-colors hover:border-sidebar-primary/40">
          {/* Delete */}
          <button
            onClick={(e) => handleDelete(e, form._id)}
            className="absolute top-3 right-3 p-2 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
            title="Delete form">
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight truncate pr-6">
              {form.name}
            </h3>

            <FormStatus published={form.isPublished} />

            <div className="pt-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4" />
                {form.submissionsCount} submissions
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(form.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* Create Form Tile */
/* ---------------------------------- */

function CreateFormTile() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-5 flex items-center justify-center hover:border-sidebar-primary/40 transition">
      <CreateFormBtn />
    </div>
  );
}

/* ---------------------------------- */
/* Status Badge */
/* ---------------------------------- */

function FormStatus({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center px-2.5 py-1 rounded-full border text-xs font-mono",
        published
          ? "border-sidebar-primary/30 bg-sidebar-primary/10 text-sidebar-primary"
          : "border-border bg-secondary/30 text-muted-foreground"
      )}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

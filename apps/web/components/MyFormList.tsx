"use client";

import {
  useGetFormsQuery,
  useDeleteFormMutation,
} from "@/lib/redux/api/formApi";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { Calendar, BarChart3, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyFormsList() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);

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
      <div className="mt-8 text-sm text-muted-foreground">
        Loading your forms…
      </div>
    );

  const myForms = forms?.filter((f: any) => f.creatorId === user?.id) || [];

  /* ---------------------------------- */
  /* Empty State */
  /* ---------------------------------- */

  if (myForms.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-border bg-card/50 backdrop-blur p-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sidebar-primary/10 mb-4">
          <Plus className="w-5 h-5 text-sidebar-primary" />
        </div>

        <h3 className="text-lg font-semibold tracking-tight">No forms yet</h3>

        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          You haven’t created any forms in this workspace yet. Start by creating
          one from the dashboard.
        </p>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold hover:opacity-90 transition">
            <Plus className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------------------------- */
  /* Forms Grid */
  /* ---------------------------------- */

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {myForms.map((form: any) => (
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

            {/* Status */}
            <FormStatus published={form.isPublished} />

            {/* Meta */}
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

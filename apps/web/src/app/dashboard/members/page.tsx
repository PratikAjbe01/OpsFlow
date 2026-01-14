"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetWorkspaceMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} from "@/lib/redux/api/workspaceApi";
import { Trash2, UserPlus, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [isInviting, setIsInviting] = useState(false);

  const { data: membersData, isLoading } = useGetWorkspaceMembersQuery(
    currentWorkspace?._id || "",
    { skip: !currentWorkspace }
  );

  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const members = membersData?.members || [];

  const currentUserRole = members.find((m: any) => m._id === user?.id)?.role;
  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    try {
      await addMember({
        workspaceId: currentWorkspace?._id,
        email: inviteEmail,
        role: inviteRole,
      }).unwrap();
      setInviteEmail("");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from workspace?")) return;
    await removeMember({
      workspaceId: currentWorkspace?._id,
      userId,
    }).unwrap();
  };

  if (!currentWorkspace)
    return <div className="p-8 text-muted-foreground">Select a workspace.</div>;

  if (isLoading)
    return <div className="p-8 text-muted-foreground">Loading team…</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground mt-1">
          Manage access to{" "}
          <span className="font-medium">{currentWorkspace.name}</span>
        </p>
      </div>

      {/* Invite */}
      {canManage && (
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-sidebar-primary/70" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Invite Member
            </h3>
          </div>

          <form
            onSubmit={handleInvite}
            className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="name@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-sidebar-primary outline-none"
              required
            />

            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              disabled={isInviting}
              className="px-5 py-2 rounded-md border border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50">
              {isInviting ? "Inviting…" : "Send Invite"}
            </button>
          </form>
        </div>
      )}

      {/* Members Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-muted-foreground font-mono uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Member</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Joined</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {members.map((member: any) => (
              <tr
                key={member._id}
                className="hover:bg-sidebar-primary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-sidebar-primary/10 flex items-center justify-center font-semibold">
                      {member.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <RoleBadge role={member.role} />
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {member.joinedAt
                    ? new Date(member.joinedAt).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-6 py-4 text-right">
                  {canManage &&
                    member._id !== user?.id &&
                    member.role !== "owner" && (
                      <button
                        onClick={() => handleRemove(member._id)}
                        className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                        title="Remove member">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Role Badge */
/* ---------------------------------- */

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono capitalize border",
        role === "owner" &&
          "border-sidebar-primary/30 bg-sidebar-primary/10 text-sidebar-primary",
        role === "admin" && "border-border bg-secondary/30 text-foreground",
        role === "viewer" &&
          "border-border bg-secondary/20 text-muted-foreground"
      )}>
      {role === "owner" ? (
        <Shield className="w-3 h-3" />
      ) : (
        <User className="w-3 h-3" />
      )}
      {role}
    </span>
  );
}

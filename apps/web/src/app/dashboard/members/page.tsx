'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { 
  useGetWorkspaceMembersQuery, 
  useAddMemberMutation, 
  useRemoveMemberMutation 
} from '@/lib/redux/api/workspaceApi';
import { Trash2, UserPlus, Shield, User } from 'lucide-react';

export default function MembersPage() {
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);
  
  // Local state for the invite form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [isInviting, setIsInviting] = useState(false);

  // API Hooks
  const { data: membersData, isLoading } = useGetWorkspaceMembersQuery(
    currentWorkspace?._id || '', 
    { skip: !currentWorkspace }
  );
  
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const members = membersData?.members || [];
  
  // Check if current user is Owner/Admin (to show controls)
  const currentUserRole = members.find((m: any) => m._id === user?.id)?.role;
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    try {
      await addMember({ 
        workspaceId: currentWorkspace?._id, 
        email: inviteEmail, 
        role: inviteRole 
      }).unwrap();
      setInviteEmail('');
      alert('Member added successfully!');
    } catch (err: any) {
      alert(err.data?.message || 'Failed to add member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMember({ 
        workspaceId: currentWorkspace?._id, 
        userId 
      }).unwrap();
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (!currentWorkspace) return <div className="p-8">Please select a workspace.</div>;
  if (isLoading) return <div className="p-8">Loading team...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500">Manage access to {currentWorkspace.name}</p>
        </div>
      </div>

      {/* 1. Invite Section (Only for Admins) */}
      {canManage && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" /> Invite New Member
          </h3>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input 
              type="email" 
              placeholder="colleague@example.com" 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
              required
            />
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              type="submit" 
              disabled={isInviting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isInviting ? 'Inviting...' : 'Invite'}
            </button>
          </form>
        </div>
      )}

      {/* 2. Members List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member: any) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {member.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${member.role === 'owner' ? 'bg-purple-100 text-purple-800' : 
                      member.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {member.role === 'owner' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Can remove if: I am admin/owner AND target is not me AND target is not owner */}
                  {canManage && member._id !== user?.id && member.role !== 'owner' && (
                    <button 
                      onClick={() => handleRemove(member._id)}
                      className="text-red-400 hover:text-red-600 p-2"
                      title="Remove Member"
                    >
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
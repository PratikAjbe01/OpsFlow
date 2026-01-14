import Form from './form.model';
import Workspace from '../workspaces/workspace.model';

export const getFormRole = async (formId: string, userId: string): Promise<string | null> => {
  try {
    // 1. Get Form
    const form = await Form.findById(formId);
    if (!form) {
        console.log(`[Auth] Form ${formId} not found`);
        return null;
    }

    // 2. Normalize User ID
    const userIdStr = userId.toString();

    // 3. Direct Creator Check (Super Owner)
    if (form.creatorId.toString() === userIdStr) return 'owner';

    // 4. Check Workspace Link
    if (!form.workspaceId) {
        console.log(`[Auth] Form ${formId} has no workspaceId`);
        return null;
    }

    // 5. Get Workspace
    const workspace = await Workspace.findById(form.workspaceId);
    if (!workspace) {
        console.log(`[Auth] Workspace ${form.workspaceId} not found`);
        return null;
    }

    // 6. Check Workspace Owner
    if (workspace.ownerId.toString() === userIdStr) return 'owner';

    // 7. Check Workspace Members
    // Ensure we handle the object structure correctly
    const member = workspace.members.find((m: any) => 
        m.userId && m.userId.toString() === userIdStr
    );

    if (member) {
        return member.role; // 'admin' | 'editor' | 'viewer'
    }

    console.log(`[Auth] User ${userIdStr} is not a member of Workspace ${workspace.name}`);
    return null;

  } catch (error) {
    console.error("[Auth] getFormRole Error:", error);
    return null;
  }
};
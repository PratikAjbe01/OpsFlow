import { Request, Response } from 'express';
import { createWorkspace, getUserWorkspaces } from './workspace.service';
import workspaceModel from './workspace.model';
import userModel from '../users/user.model';

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    // req.user is guaranteed by the 'protect' middleware
    const workspace = await createWorkspace(name, req.user!._id as string);
    
    res.status(201).json({ success: true, workspace });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const workspaces = await getUserWorkspaces(req.user!._id as string);
    res.status(200).json({ success: true, workspaces });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const addMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Workspace ID
    const { email, role } = req.body;

    // A. Verify Permissions (Only Owner/Admin can add)
    const workspace = await workspaceModel.findOne({ 
      _id: id, 
      $or: [
        { ownerId: req.user!._id },
        { 'members.userId': req.user!._id, 'members.role': 'admin' }
      ]
    });

    if (!workspace) {
      res.status(403).json({ success: false, message: 'Unauthorized or Workspace not found' });
      return;
    }

    // B. Find User to Add
    const userToAdd = await userModel.findOne({ email });
    if (!userToAdd) {
      res.status(404).json({ success: false, message: 'User with this email not found' });
      return;
    }

    // C. Check if already a member
    const isMember = workspace.members.some(m => m.userId.toString() === userToAdd._id.toString());
    const isOwner = workspace.ownerId.toString() === userToAdd._id.toString();

    if (isMember || isOwner) {
      res.status(409).json({ success: false, message: 'User is already a member' });
      return;
    }

    // D. Add to Workspace
    workspace.members.push({
      userId: userToAdd._id as any,
      role: role || 'viewer',
      joinedAt: new Date()
    });

    await workspace.save();

    res.status(200).json({ success: true, message: 'Member added', workspace });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params; // memberId is the USER ID to remove

    const workspace = await workspaceModel.findOneAndUpdate(
      { 
        _id: id,
        $or: [
            { ownerId: req.user!._id }, // Owner can remove anyone
            { 'members.userId': req.user!._id, 'members.role': 'admin' } // Admin can remove
        ] 
      },
      { $pull: { members: { userId: memberId } } }, // Remove from array
      { new: true }
    );

    if (!workspace) {
      res.status(403).json({ success: false, message: 'Unauthorized or Workspace not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Member removed', workspace });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Workspace Members 
export const getMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validate ID format first
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({ success: false, message: 'Invalid Workspace ID' });
        return;
    }

    // 2. Strict Query
    const workspace = await workspaceModel.findOne({
      _id: id,
      $or: [
        { ownerId: req.user!._id }, 
        { 'members.userId': req.user!._id }
      ]
    })
    .populate('ownerId', 'name email')
    .populate('members.userId', 'name email');

    if (!workspace) {
      // Debugging: Print why it failed
      console.log(`Auth Failed: User ${req.user!._id} not found in Workspace ${id}`);
      res.status(403).json({ success: false, message: 'Unauthorized access to workspace members' });
      return;
    }
    // Format response to be clean list
    const members = [
      { 
        _id: workspace.ownerId._id, 
        name: (workspace.ownerId as any).name, 
        email: (workspace.ownerId as any).email, 
        role: 'owner' 
      },
      ...workspace.members.map((m: any) => ({
        _id: m.userId._id,
        name: m.userId.name,
        email: m.userId.email,
        role: m.role,
        joinedAt: m.joinedAt
      }))
    ];

    res.status(200).json({ success: true, members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


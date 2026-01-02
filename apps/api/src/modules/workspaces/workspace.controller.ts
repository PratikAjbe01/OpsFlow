import { Request, Response } from 'express';
import { createWorkspace, getUserWorkspaces } from './workspace.service';

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
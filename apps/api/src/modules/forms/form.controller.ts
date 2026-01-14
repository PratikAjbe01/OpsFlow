import { Request, Response } from 'express';
import { createForm, getWorkspaceForms, getFormById } from './form.service';
import Form from './form.model';
import { getFormRole } from './forms.utils';
// Create a new empty form
export const create = async (req: Request, res: Response) => {
  try {
    const { name, workspaceId } = req.body;
    const form = await createForm(workspaceId, req.user!._id as string, name);
    res.status(201).json({ success: true, form });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all forms for the active workspace
export const getAll = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.query;
    if (!workspaceId) throw new Error('Workspace ID is required');
    
    const forms = await getWorkspaceForms(workspaceId as string);
    res.status(200).json({ success: true, forms });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get single form details (for the editor)
export const getOne = async (req: Request, res: Response) => {
  try {
    const form = await getFormById(req.params.id);
    if (!form) throw new Error('Form not found');
    res.status(200).json({ success: true, form });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};



export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Ensure only the owner can delete
    const form = await Form.findOneAndDelete({ _id: id, creatorId: req.user!._id });
    
    if (!form) {
      res.status(404).json({ success: false, message: 'Form not found or unauthorized' });
      return;
    }
    
    res.status(200).json({ success: true, message: 'Form deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { content, theme, settings } = req.body;
    
    // Debugging Log
    console.log(`[Update] Checking role for Form: ${req.params.id}, User: ${req.user!._id}`);

    const role = await getFormRole(req.params.id, req.user!._id as string);
    
    console.log(`[Update] Resolved Role: ${role}`);

    if (!role || (role !== 'owner' && role !== 'admin' && role !== 'editor')) {
        return res.status(403).json({ success: false, message: 'Read-only access' });
    }

    const form = await Form.findByIdAndUpdate(
        req.params.id, 
        { content, theme, settings }, 
        { new: true }
    );
    
    res.status(200).json({ success: true, form });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
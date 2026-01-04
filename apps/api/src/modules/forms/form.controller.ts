import { Request, Response } from 'express';
import { createForm, getWorkspaceForms, getFormById, updateContent } from './form.service';
import Form from './form.model';
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
    
    const form = await Form.findByIdAndUpdate(
        req.params.id, 
        { content, theme, settings }, // <--- Save them
        { new: true }
    );
    
    res.status(200).json({ success: true, form });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
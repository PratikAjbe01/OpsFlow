import { Request, Response } from 'express';
import { generateFormSchema } from './ai.service';
import { updateFormContent } from '../forms/form.service';

export const generateForm = async (req: Request, res: Response) => {
  try {
    const { description, formId } = req.body;
    
    // 1. Generate Schema using Gemini
    const generatedContent = await generateFormSchema(description);
    
    // 2. Automatically save it to the form (optional, or just return it to UI)
    // Here we save it directly to save a step
    if (formId) {
      await updateFormContent(formId, generatedContent);
    }

    res.status(200).json({ success: true, content: generatedContent });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import Form from './form.model';

export const createForm = async (workspaceId: string, userId: string, name: string) => {
  return await Form.create({
    workspaceId,
    creatorId: userId,
    name,
    content: [], // Empty by default
  });
};

export const getWorkspaceForms = async (workspaceId: string) => {
  return await Form.find({ workspaceId }).sort({ createdAt: -1 });
};

export const getFormById = async (formId: string) => {
  return await Form.findById(formId);
};

export const updateFormContent = async (formId: string, content: any[]) => {
  return await Form.findByIdAndUpdate(formId, { content }, { new: true });
};
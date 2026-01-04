import mongoose, { Schema, Document } from 'mongoose';

// Definition of a single field (Text, Checkbox, etc.)
interface FormField {
  id: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select/dropdowns

}

export interface IForm extends Document {
  workspaceId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  name: string;
  description?: string; // <--- The JSON Schema
  isPublished: boolean;
  submissionsCount: number;
  
  content: any[];
  theme: any; // <--- NEW: Store colors/styles
  settings: {
    collectEmails: boolean; // <--- NEW: Google Forms style
    limitOneResponse: boolean; // <--- NEW: Prevent double submission
  };
  shareUrl?: string; // Virtual field
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema: Schema = new Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: 'Untitled Form' },
    description: { type: String },
    content: { type: Array, default: [] }, // Flexible JSON storage
    isPublished: { type: Boolean, default: false },
    submissionsCount: { type: Number, default: 0 },
    theme: { type: Object, default: {} },
   settings: {
      collectEmails: { type: Boolean, default: false },
      limitOneResponse: { type: Boolean, default: false },
    }
  },
  { timestamps: true }
);

export default mongoose.model<IForm>('Form', FormSchema);
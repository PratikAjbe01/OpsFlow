import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  formId: mongoose.Types.ObjectId;
  data: Record<string, any>; // Flexible JSON for answers
  submittedAt: Date;
  respondentEmail?: string; // Optional, unless "Collect Emails" is on
}

const SubmissionSchema: Schema = new Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    data: { type: Object, required: true },
    respondentEmail: { type: String, lowercase: true, trim: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);


SubmissionSchema.index({ formId: 1, respondentEmail: 1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
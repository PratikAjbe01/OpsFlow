import Workspace from './workspace.model';
import User from '../users/user.model';
import mongoose from 'mongoose';

export const createWorkspace = async (name: string, userId: string) => {
  // 1. Generate Slug (Simple version: "My Team" -> "my-team")
  // In production, you'd check for duplicates and append numbers
  const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now().toString().slice(-4);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Create Workspace
    const workspace = await Workspace.create([{
      name,
      slug,
      ownerId: userId,
  members: [{ userId: userId, role: 'admin' }]
    }], { session });

    // 3. Add to User's list
    await User.findByIdAndUpdate(userId, {
      $push: { workspaces: { workspace: workspace[0]._id, role: 'admin' } }
    }, { session });

    await session.commitTransaction();
    return workspace[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserWorkspaces = async (userId: string) => {
  return await Workspace.find({ "members.user": userId });
};
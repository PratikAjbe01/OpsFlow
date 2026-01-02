import mongoose from 'mongoose';
export interface IUser extends Document{
name:String,
email:String,
password:String,
role:'admin'|'user'|'employee',
provider:'email'|'google'|'github',
workspaces: { workspace: mongoose.Types.ObjectId; role: string }[];
createdAt:Date;


} 
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:'user',enum:['user','admin','employee']},
    provider:{type:String,default:'email'},
    
workspaces: [
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    role: { type: String, enum: ['admin', 'editor', 'viewer'] }
  }
],
},{timestamps:true});

export default mongoose.model<IUser>('User',UserSchema);

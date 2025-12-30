import mongoose from 'mongoose';
export interface IUser extends Document{
name:String,
email:String,
password:String,
role:'admin'|'user'|'employee',
provider:'email'|'google'|'github',
createdAt:Date;

} 
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:'user',enum:['user','admin','employee']},
    provider:{type:String,default:'email'},
},{timestamps:true});

export default mongoose.model<IUser>('User',UserSchema);

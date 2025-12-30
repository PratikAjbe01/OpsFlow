import bcrypt from 'bcryptjs';
import User,{IUser} from '../users/user.model';
import { genrateAccessToken, generateRefreshToken } from '../../utils/jwt'
export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};


export const loginUser=async(data:any)=>{
    const {email,password,role}=data;
    const user=await User.findOne({
      email,

    }).select('+password');
    if(!user){
        throw new Error('Invalid credentials');
    }
    const isMatch=await bcrypt.compare(password,user.password as string);
    if(!isMatch){
        throw new Error('Invalid credentials');
    }
    const accessToken=genrateAccessToken(user);
    const refreshToken=generateRefreshToken(user);
    return {user,accessToken,refreshToken}
};
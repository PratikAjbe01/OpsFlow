import {Request,Response} from 'express';
import { loginUser, registerUser } from './auth.services';
import { loginSchema, registerSchema } from './auth.schema';
import { sendRefreshToken } from '../../utils/jwt';

export const register=async(req:Request,res:Response):Promise<void>=>{
try {
  const parsedBody=registerSchema.parse(req.body);
  const user=await registerUser(parsedBody);
  res.status(201).json({
    success:true,
    message:'User registered successfully',
    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    }
  })  
} catch (error:any) {
   if (error.name === 'ZodError') {
       res.status(400).json({ success: false, errors: error.errors });
       return;
    }
    res.status(401).json({ success: false, message: error.message });
}
};

export const login=async(req:Request,res:Response):Promise<void>=>{
    try {
        const parsedBody=loginSchema.parse(req.body)
        const {user,accessToken,refreshToken}=await loginUser(parsedBody);
        sendRefreshToken(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken, // Frontend stores this in memory (Redux)
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    } catch (error:any) {
        if (error.name === 'ZodError') {
       res.status(400).json({ success: false, errors: error.errors });
       return;
    }
    res.status(401).json({ success: false, message: error.message });
    }
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user, // This comes from the middleware
  });
};
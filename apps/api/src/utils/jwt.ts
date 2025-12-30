import jwt from 'jsonwebtoken';
import {Response} from 'express';
import {IUser} from '../modules/users/user.model';


interface TokenPayLoad{
    userId:string;
    role:string;
}

export const genrateAccessToken=(user:IUser):string=>{
    return jwt.sign( { userId:user._id, role:user.role },
        process.env.JWT_SECRET as string,
        {expiresIn:'15m'}
    );
};


export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
};


export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true, // Prevents JS access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
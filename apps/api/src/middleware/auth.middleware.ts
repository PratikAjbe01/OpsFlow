import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User, {IUser} from  '../modules/users/user.model';


interface DecodedToken{
    userId:string;
    role:string;
    iat:number;
    exp:number;
}
export const protect=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token=req.headers.authorization.split(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as DecodedToken;
            const user=await User.findById(decoded.userId).select('-password');
            if(!user){
                res.status(401).json({
                    message:'not authorized,user not found',
                    success:false,
                })
                return;
            }
            req.user=user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                success:false,
                message:'not authorized token failed'
            })
        }
    }
    if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
}


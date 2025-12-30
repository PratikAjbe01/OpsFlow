import z from 'zod';
export const registerSchema=z.object({
    name:z.string().min(2,'name must have 2 characters'),
    email:z.string().email('invalid email'),
    password:z.string().min(8,'password must have 8 characters'),
})

export const loginSchema=z.object({
    email:z.string().email('invalid email'),
    password:z.string().min(8,'password must have 8 characters'),
   
})
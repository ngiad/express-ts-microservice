import {z} from 'zod';
import { ErrLoginPasswordValidation, ErrLoginUsernameValidation, ErrRegisterNameValidation, ErrRegisterPasswordValidation, ErrRegisterUsernameValidation } from '../dto/error';

export const loginSchema = z.object({
    username: z.string().min(6,ErrLoginUsernameValidation),
    password: z.string().min(8,ErrLoginPasswordValidation),
})

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name : z.string().min(1, ErrRegisterNameValidation),
    image : z.string().optional(),
    email : z.string().email(),
    username: z.string().min(6,ErrRegisterUsernameValidation),
    password: z.string().min(8,ErrRegisterPasswordValidation),
})

export type RegisterType = z.infer<typeof registerSchema>;

export interface IAuthService {
    login: (data: LoginType) => Promise<{ token: string; }>;
    register: (data: RegisterType) => Promise<{ token: string; refreshToken: string }>;
    logout: (refreshToken: string) => Promise<void>;
}


export interface IResisterCommand{
    data: RegisterType;
}

export interface ILoginCommand{
    data: LoginType;
}

export interface IVerifyTokenCommand{
    data : string
}



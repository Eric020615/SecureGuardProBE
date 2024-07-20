import { UserRole } from "../models/user.model";

export interface JwtPayloadDto{
    userGUID: string;
    role: UserRole;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterUserDto {
    email: string;
    password: string;
    confirmPassword: string;
}

// export type UserCreationParams = Pick<LoginDto, "email" | "password">;
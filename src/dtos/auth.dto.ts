export interface JwtPayloadDto{
    userGUID: string;
    role: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

// export type UserCreationParams = Pick<LoginDto, "email" | "password">;
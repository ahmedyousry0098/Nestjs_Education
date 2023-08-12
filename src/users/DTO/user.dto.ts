import {IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsJWT, Length} from 'class-validator'
import {Expose, Exclude} from 'class-transformer'
import { ObjectId } from 'mongoose';

export class UserResponse {
    @Expose()
    id: ObjectId

    @Expose()
    username: string;

    @Expose()
    email: string
}

export class RegisterDto {
    constructor() {}

    @IsString()
    username: string

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 5,
        minUppercase: 1,
    })
    password: string

    @IsPhoneNumber('EG')
    phoneNumber: string

    @IsOptional({always: true})
    isDeleted: boolean
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 5,
        minUppercase: 1
    })
    password: string
}

export class ForgetPasswordDto {
    @IsEmail()
    email: string
}

export class ConfirmEmailDto {
    @IsJWT()
    token: string
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(5)
    resetCode: string

    @IsString()
    @IsStrongPassword()
    password: string
}
import {IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsJWT, Length, IsEnum} from 'class-validator'
import {Expose, Exclude, Transform} from 'class-transformer'
import mongoose from 'mongoose';
import { GENERALROLE, PARTIALROLES } from '../enums/user.role';

export class UserResponse {
    @Expose()
    _id: mongoose.Types.ObjectId

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

    @IsString()
    @IsOptional()
    @IsEnum(PARTIALROLES)
    @Transform((role) => role.value.toLowerCase())
    role: PARTIALROLES
}

export class ChangeRoleDto {
    
    @IsString()
    @IsEnum(GENERALROLE)
    role: GENERALROLE
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

export class UpdateProfileDto {
    @IsString()
    username: string

    @IsPhoneNumber('EG')
    phoneNumber: string
}

export class UpdatePasswordDto {

    @IsStrongPassword({
        minLength: 5,
        minUppercase: 1,
    })
    oldPassword: string;

    @IsStrongPassword({
        minLength: 5,
        minUppercase: 1,
    })
    newPassword: string;
}
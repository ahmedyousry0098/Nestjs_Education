import {Injectable, Put, NotAcceptableException, BadRequestException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/user.model';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { ChangeRoleDto, UpdateProfileDto, UserResponse } from '../DTO/user.dto';
import {compareSync} from 'bcrypt'

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
    ) {}

    async updateProfile (
        request: Request, 
        response: Response, 
        body: UpdateProfileDto, 
        profileId: string, 
        user: UserResponse
    ) {
        if (user._id.toString() != profileId) {
            throw new NotAcceptableException()
        }
        const {username, phoneNumber} = body
        const profile = await this.UserModel.findByIdAndUpdate(profileId, {username, phoneNumber})
        if (!profile) {
            throw new BadRequestException()
        }
        return response.status(200).json({message: 'Profile Updated Successfully'})
    }

    async changePassword (
        response: Response,
        profileId: string, 
        newPassword: string, 
        oldPassword: string,
        user: UserResponse
    ) {
        if (user._id.toString() != profileId) {
            throw new NotAcceptableException()
        }
        const profile = await this.UserModel.findById(profileId)
        if (!profile) {
            throw new BadRequestException()
        }
        const isPassMatch = compareSync(oldPassword, profile.password)
        if (!isPassMatch) {
            throw new UnauthorizedException('Invalid Credintials')
        }
        profile.password = newPassword
        if (!profile.save()) {
            throw new InternalServerErrorException()
        }
        return response.json({message: 'Password Changed Successfuly!'})
    }

    async deleteProfile (
        request: Request, 
        response: Response, 
        profileId: string, 
        user: UserResponse
    ) {
        if (user._id.toString() != profileId) {
            throw new NotAcceptableException()
        }
        const profile = await this.UserModel.findByIdAndUpdate(profileId, {isDeleted: true})
        if (!profile) {
            throw new BadRequestException()
        }
        return response.status(200).clearCookie('token').json({message: 'Profile Deleted Successfully'})
    }

    async changeUserRole(userId: string, {role}: ChangeRoleDto) {
        
        const user = await this.UserModel.findById(userId)
        if (!user) {
            throw new BadRequestException()
        }

        user.role = role
        if (!user.save()) {
            throw new InternalServerErrorException()
        }
        return user
    }
} 
import {Injectable, Put, NotAcceptableException, BadRequestException, InternalServerErrorException, UnauthorizedException} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/user.model';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { ChangeRoleDto, UpdateProfileDto } from '../DTO/user.dto';
import {compareSync} from 'bcrypt'
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { Course, CourseDocument } from 'src/courses/Schemas/course.model';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>
    ) {}

    async updateProfile (
        request: Request, 
        response: Response, 
        body: UpdateProfileDto, 
        profileId: mongoose.Types.ObjectId, 
        user: PartialUser
    ) {
        if (user._id.toString() != profileId.toString()) {
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
        profileId: mongoose.Types.ObjectId, 
        newPassword: string, 
        oldPassword: string,
        user: PartialUser
    ) {
        if (user._id.toString() != profileId.toString()) {
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
        profileId: mongoose.Types.ObjectId, 
        user: PartialUser
    ) {
        if (user._id.toString() != profileId.toString()) {
            throw new NotAcceptableException()
        }
        const profile = await this.UserModel.findByIdAndUpdate(profileId, {isDeleted: true})
        if (!profile) {
            throw new BadRequestException()
        }
        return response.status(200).clearCookie('token').json({message: 'Profile Deleted Successfully'})
    }

    async changeUserRole(userId: mongoose.Types.ObjectId, {role}: ChangeRoleDto) {
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

    async myProfile (user: PartialUser) {
        const {_id} = user
        const myCourses = await this.CourseModel.find({enrolledBy: {$in: _id}})
        return {user, courses: myCourses}
    }
} 
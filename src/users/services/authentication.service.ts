import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto, ForgetPasswordDto } from '../DTO/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from '../Schemas/user.model';
import { Model } from 'mongoose';
import {compareSync} from 'bcrypt'
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { generateCustomCode } from '../utils/customCode';


@Injectable()
export class AuthenticationService {
    constructor(@InjectModel(User.name) private readonly UserModel: Model<UserDocument>, private _JwtService: JwtService) {}

    async register(user: RegisterDto, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})
        if (existsUser) throw new ConflictException('Email Already Exist, Try To Login..')
        const newUser = await this.UserModel.create(user)
        if (!newUser) throw new InternalServerErrorException('Something Went Wrong Please Try Again..')
        const token = this._JwtService.sign({id: newUser._id, email: newUser.email}, {secret: process.env.JWT_SECRET})
        return response.status(201).json({message: 'Registerd Successfully!', token})
    }

    async login(user: LoginDto, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})
        if (!existsUser) throw new UnauthorizedException('In-valid Login Credintials')
        const isPassMatch = compareSync(user.password, existsUser.password)
        if (!isPassMatch) throw new UnauthorizedException('In-valid Login Credintials')
        const token = this._JwtService.sign({id: existsUser._id,email: existsUser.email})
        return response.status(200).json({message: 'Logged In Successfully!', token})
    }

    async forgetPassword(user: ForgetPasswordDto, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})
        if (!existsUser) throw new UnauthorizedException('In-valid Email Address')
        const randomChar = generateCustomCode(5)
        existsUser.resetPasswordCode = randomChar;
        if (!existsUser.save()) throw new InternalServerErrorException('Something Went Wrong Please Try Again')
        return response.status(200).json({message: 'Done!'})
    }
}

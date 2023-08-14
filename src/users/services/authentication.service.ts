import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto, RegisterDto, ForgetPasswordDto, ConfirmEmailDto, ResetPasswordDto } from '../DTO/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from '../Schemas/user.model';
import { Model } from 'mongoose';
import {compareSync} from 'bcrypt'
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { generateCustomCode } from '../../utils/customCode';
import { JwtPayload } from 'src/intefaces/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>, 
        private _JwtService: JwtService,
        private _MailService: MailService
    ) {}

    async register(user: RegisterDto, request: Request, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})        
        if (existsUser) {
            throw new ConflictException('Email Already Exist, Try To Login..')
        }
        const newUser = await this.UserModel.create(user)
        if (!newUser) {
            throw new InternalServerErrorException('Something Went Wrong Please Try Again..')
        }
        const token = this._JwtService.sign(
            {id: newUser._id, email: newUser.email}, 
            {secret: process.env.JWT_SECRET, expiresIn: 60*10}
        )
        const confirmationLink = `${request.protocol}://${request.headers.host}/confirm-email?token=${token}`
        await this._MailService.sendConfirmEmailLink(newUser.email, confirmationLink)
        return response.status(201).json({message: ' Please Check Your Email To Confirm Your Account'})
    }

    async login(user: LoginDto, request: Request, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})        
        if (!existsUser) {
            throw new UnauthorizedException('In-valid Login Credintials')
        }
        const isPassMatch = compareSync(user.password, existsUser.password)
        if (!isPassMatch) {
            throw new UnauthorizedException('In-valid Login Credintials')
        }
        if (!existsUser.isConfirmed) {
            const token = this._JwtService.sign(
                {id: existsUser._id, email: existsUser.email}, 
                {secret: process.env.JWT_SECRET, expiresIn: 60*10}
            )
            const confirmationLink = `${request.protocol}://${request.headers.host}/confirm-email?token=${token}`
            await this._MailService.sendConfirmEmailLink(existsUser.email, confirmationLink)
            throw new UnauthorizedException('Please Check Your Email To Confirm Your Account')
        }

        if(existsUser.isDeleted) {
            throw new UnauthorizedException('Account have been deleted!')
        }
        const token = this._JwtService.sign({id: existsUser._id,email: existsUser.email}, {secret: process.env.JWT_SECRET})
        return response.status(200).cookie('token', token).json({message: 'Logged In Successfully!'})
    }

    async confirmEmail({token}: ConfirmEmailDto, response: Response) {
        const {id, email} = this._JwtService.decode(token) as JwtPayload
        if (!id || !email) {
            throw new UnauthorizedException()
        }
        const user = await this.UserModel.findByIdAndUpdate(id, {isConfirmed: true})
        if (!user) {
            throw new UnauthorizedException('Please Check Your Credintials and Try Again!')
        }
        if (user.isConfirmed) {
            throw new BadRequestException('Email Already Confirmed!')
        }
        if (user.isDeleted) {
            throw new UnauthorizedException('Account have been deleted!')
        }
        const newToken = this._JwtService.sign({id: user._id,email: user.email}, {secret: process.env.JWT_SECRET})
        return response.status(200).cookie('token', newToken).json({message: 'Email Confirmed'})
    }

    async forgetPassword(user: ForgetPasswordDto, request: Request, response: Response) {
        const existsUser = await this.UserModel.findOne({email: user.email})
        if (!existsUser) {
            throw new UnauthorizedException('In-valid Email Address')
        }
        if (!existsUser.isConfirmed) {
            const token = this._JwtService.sign(
                {id: existsUser._id, email: existsUser.email}, 
                {secret: process.env.JWT_SECRET, expiresIn: 60*10}
            )
            const confirmationLink = `${request.protocol}://${request.headers.host}/confirm-email?token=${token}`
            await this._MailService.sendConfirmEmailLink(existsUser.email, confirmationLink)
            throw new UnauthorizedException('Please Check Your Email To Confirm Your Account First')
        }
        if(existsUser.isDeleted) {
            throw new UnauthorizedException('Account have been deleted!')
        }
        const randomChar = generateCustomCode(5)
        existsUser.resetPasswordCode = randomChar;
        await this._MailService.sendResetPasswordCode(existsUser.email, randomChar)
        if (!existsUser.save()) {
            throw new InternalServerErrorException('Something Went Wrong Please Try Again')
        }
        return response.status(200).json({message: 'Please Check Your Email and Follow Instructions'})
    }

    async resetPassword({email, resetCode, password}: ResetPasswordDto, response: Response) {
        const user = await this.UserModel.findOne({email: email, resetPasswordCode: resetCode})
        if (!user) {
            throw new UnauthorizedException()
        }
        user.password = password
        user.resetPasswordCode = undefined
        if (!user.save()) {
            throw new InternalServerErrorException('Something Went Wrong Please Try Again')
        }
        return response.status(200).json({messge: 'Password Updated Succefully'})
    }

    async whoIam(token: string) {
        if (!token) throw new UnauthorizedException('Please Login First')
        const {id} = this._JwtService.decode(token) as JwtPayload
        const user = await this.UserModel.findById(id)
        if (!user) {
            throw new UnauthorizedException('Please Login First')
        }
        return user
    }

    async logOut(request: Request, response: Response) {
        if (!request.cookies.token) return response.json({message: 'Already Logged Out'})
        return response.clearCookie('token').json({message: 'logged out successfully'});
    }
}
import {NestMiddleware, Injectable, UnauthorizedException, ForbiddenException} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { plainToClassFromExist, plainToInstance } from 'class-transformer'
import { log } from 'console'
import { Request, Response, NextFunction } from 'express'
import { Model } from 'mongoose'
import { CookiePayload, JwtPayload } from 'src/interfaces/jwt'
import { User, UserDocument } from 'src/users/Schemas/user.model'

declare global {
    namespace Express {
        interface Request {
            user ?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
        private _JwtService: JwtService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const {token} = req.cookies        
        if (!token) {
            throw new UnauthorizedException('Please Login First')
        }
        const decode = this._JwtService.decode(token) as JwtPayload
        if (!decode._id) {
            throw new ForbiddenException('Please Provide Valid Authentication Key!')
        }
        const user = await this.UserModel.findById(decode._id, {_id: 1, email: 1, role: 1, lastPasswordChenge: 1})
        if (user && new Date(decode.iat*1000) > user.lastPasswordChenge) {
            req.user = user
        }
        next()
    }
}
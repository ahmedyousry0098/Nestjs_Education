import {CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtPayload } from 'src/intefaces/jwt'
import { User, UserDocument } from 'src/users/Schemas/user.model'

export class AuthGuard implements CanActivate {
    constructor(
        private _JwtService: JwtService,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
    ) {

    }
    async canActivate(context: ExecutionContext) {
        const requset = context.switchToHttp().getRequest()
        const token = requset.cookie?.token
        if (!token) throw new UnauthorizedException('Please Login First To Reach This Page')
        const {id} = this._JwtService.decode(token) as JwtPayload
        const user = await this.UserModel.findById(id)
        if (!user) throw new UnauthorizedException('Please Login First To Reach Thi')
        return true
    }
}
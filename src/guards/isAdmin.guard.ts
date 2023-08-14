import {BadRequestException, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Observable } from 'rxjs'
import { JwtPayload } from 'src/intefaces/jwt'
import { User, UserDocument } from 'src/users/Schemas/user.model'


export class AdminGuard implements CanActivate {
    constructor(
        private _JwtService: JwtService,
        @InjectModel(User.name) private UserModel: Model<UserDocument>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.cookie?.token
        if (!token) throw new UnauthorizedException('Please Login First To Reach This Page')
        const {id} = this._JwtService.decode(token) as JwtPayload
        if (!id) throw new BadRequestException('In-valid Authentication Key')
        const user = await this.UserModel.findById(id)
        if (!user || !user.isAdmin) throw new UnauthorizedException()
        return true
    }
}
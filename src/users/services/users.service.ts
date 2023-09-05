import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from '../Schemas/user.model';
import mongoose, { Model } from 'mongoose';
import { ApiFeatures, FindDTO } from 'src/utils/apiFeatures';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
    
    async findUser (id: mongoose.Types.ObjectId) {
        const user = await this.UserModel.findById(id)
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }

    async getAllUsers(queryData:FindDTO) {
        const mongooseQuery = this.UserModel.find({})
        const procQuery = new ApiFeatures(mongooseQuery, queryData).pagination().search().filter()
        const users = await procQuery.mongooseQuery
        if (!users) {
            throw new InternalServerErrorException()
        }
        if (!users.length) {
            return 'no users found'
        }
        return users
    }   
}
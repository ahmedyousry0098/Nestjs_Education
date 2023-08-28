import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'
import { GENERALROLE } from '../enums/user.role';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    constructor () {}

    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    phoneNumber: string;

    @Prop({enum: GENERALROLE, default: GENERALROLE.USER})
    role: GENERALROLE

    @Prop({default: false})
    isDeleted: boolean;

    @Prop({default: false})
    isConfirmed: boolean

    @Prop()
    resetPasswordCode: string
}

export const UserSchema = SchemaFactory.createForClass(User)
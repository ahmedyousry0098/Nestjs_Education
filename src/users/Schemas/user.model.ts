import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'
import { GENERALROLE } from '../enums/user.role';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    constructor () {}

    @Prop({type: String, required: true})
    username: string;

    @Prop({type: String, required: true, unique: true})
    email: string;

    @Prop({type: String, required: true})
    password: string;

    @Prop({type: String})
    phoneNumber: string;

    @Prop({enum: GENERALROLE, default: GENERALROLE.USER})
    role: GENERALROLE

    @Prop({type: Boolean, default: false})
    isDeleted: boolean;

    @Prop({type: Boolean, default: false})
    isConfirmed: boolean

    @Prop({type: String, maxlength: 6})
    resetPasswordCode: string

    @Prop({type: Date})
    lastPasswordChenge: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
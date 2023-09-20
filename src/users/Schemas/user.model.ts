import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'
import { GENERALROLE } from '../enums/user.role';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>

@Schema({
    timestamps: true,
})
export class User {
    constructor () {}

    @Prop({type: String, required: true})
    username: string;

    @Prop({type: String, required: true, unique: true})
    email: string;

    @Exclude()
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

    @Exclude()
    @Prop({type: String, maxlength: 6})
    resetPasswordCode: string

    @Exclude()
    @Prop({type: Date})
    lastPasswordChenge: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
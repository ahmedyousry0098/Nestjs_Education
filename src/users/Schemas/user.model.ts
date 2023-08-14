import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

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

    @Prop({default: false})
    isAdmin: boolean

    @Prop({default: false})
    isDeleted: boolean;

    @Prop({default: false})
    isConfirmed: boolean

    @Prop()
    resetPasswordCode: string
}

export const UserSchema = SchemaFactory.createForClass(User)
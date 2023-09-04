import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument, ObjectId} from 'mongoose'
import { Iimage } from 'src/intefaces/image'
import {Document, Types} from 'mongoose'

export type CourseDocument = HydratedDocument<Course>

@Schema({
    virtuals: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})
export class Course extends Document {
    @Prop()
    generalId: string;

    @Prop({required: true})
    name: string

    @Prop()
    description: string

    @Prop({required: true})
    price: number

    @Prop({type: Object, required: true})
    img: Iimage

    @Prop()
    enrolledBy: [ObjectId]

    @Prop({default: false})
    isDeleted: false

    @Prop({type: Types.ObjectId})
    instructorId: ObjectId
}

export const CourseSchema = SchemaFactory.createForClass(Course)

CourseSchema.virtual('instructor', {
    ref: 'User',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true
})
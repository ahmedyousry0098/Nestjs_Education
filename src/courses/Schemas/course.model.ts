import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId} from 'mongoose'
import { Iimage } from 'src/interfaces/image'
import {Document, Types} from 'mongoose'
import { generateCustomCode } from 'src/utils/customCode'

export type CourseDocument = HydratedDocument<Course>

@Schema({
    timestamps: true,
    virtuals: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})
export class Course extends Document {
    @Prop({type: String, default: generateCustomCode(4)})
    generalId: string;

    @Prop({type: String, required: true})
    name: string

    @Prop({type: String, maxlength: 5000})
    description: string

    @Prop({type: Number, required: true})
    price: number

    @Prop({type: Object, required: true})
    img: Iimage

    @Prop({type: mongoose.Types.ObjectId, ref: 'Category'})
    category: mongoose.Types.ObjectId

    @Prop([{type: mongoose.Types.ObjectId, ref: 'User'}])
    enrolledBy: [mongoose.Types.ObjectId]

    @Prop({type: Boolean, default: false})
    isDeleted: false

    @Prop({type: mongoose.Types.ObjectId, ref: 'User'})
    instructorId: mongoose.Types.ObjectId
}

export const CourseSchema = SchemaFactory.createForClass(Course)

CourseSchema.virtual('instructor', {
    ref: 'User',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true
})
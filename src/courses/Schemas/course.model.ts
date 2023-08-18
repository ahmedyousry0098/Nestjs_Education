import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument, ObjectId} from 'mongoose'
import { Iimage } from 'src/intefaces/image'
import {Document} from 'mongoose'

export type CourseDocument = HydratedDocument<Course>

@Schema()
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
}

export const CourseSchema = SchemaFactory.createForClass(Course)
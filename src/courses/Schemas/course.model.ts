import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument, ObjectId} from 'mongoose'

export type CourseDocument = HydratedDocument<Course>

@Schema()
export class Course {

    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop()
    enrolledBy: [ObjectId]

    @Prop()
    isDeleted: false
}

export const CourseSchema = SchemaFactory.createForClass(Course)
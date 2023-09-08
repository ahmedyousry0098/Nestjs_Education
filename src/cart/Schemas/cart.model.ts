import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument, Types } from "mongoose";

export type CartDocument = HydratedDocument<Cart>

@Schema({
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
export class Course {
    @Prop({type: mongoose.Types.ObjectId, ref: 'Course'})
    course: mongoose.Types.ObjectId

    @Prop({type: Number, default: 0})
    discount: number
}

const NestedCourseSchema = SchemaFactory.createForClass(Course)

@Schema({
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
export class Cart extends Document {
    @Prop({type: mongoose.Types.ObjectId, ref: 'User', required: true})
    user: mongoose.Types.ObjectId;

    @Prop([{type: NestedCourseSchema}])
    courses: Course[]
}

export const CartSchema = SchemaFactory.createForClass(Cart)

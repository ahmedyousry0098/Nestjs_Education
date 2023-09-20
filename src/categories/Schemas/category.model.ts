import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>

@Schema({
    timestamps: true
})
export class Category {
    @Prop({type: String, required: true, unique: true}) 
    name: string

    @Prop({type: mongoose.Types.ObjectId, ref: 'User'})
    createdBy: mongoose.Types.ObjectId

    @Prop({type: mongoose.Types.ObjectId, ref: 'User'}) 
    updatedBy: mongoose.Types.ObjectId
} 

export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.name = this.name.toLowerCase().replace(" ", "-")
    }
    next()
})
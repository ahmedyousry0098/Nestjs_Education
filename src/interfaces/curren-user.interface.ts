import mongoose from "mongoose";

export interface PartialUser {
    _id: mongoose.Types.ObjectId,
    email: string,
    role: string
}
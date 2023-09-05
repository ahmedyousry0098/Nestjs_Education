import { ObjectId } from "mongoose";

export interface PartialUser {
    _id: ObjectId,
    email: string,
    role: string
}
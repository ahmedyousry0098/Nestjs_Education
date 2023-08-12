import { ObjectId } from "mongoose";

export interface JwtPayload {
    id: ObjectId;
    email: string;
}
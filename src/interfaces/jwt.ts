import { ObjectId } from "mongoose";

export interface JwtPayload {
    _id: ObjectId;
    email: string;
}

export interface CookiePayload {
    token: string
}
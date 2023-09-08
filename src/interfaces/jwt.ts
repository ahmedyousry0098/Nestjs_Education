import { ObjectId } from "mongoose";

export interface JwtPayload {
    _id: ObjectId;
    email: string;
    iat: number
}

export interface CookiePayload {
    token: string
}
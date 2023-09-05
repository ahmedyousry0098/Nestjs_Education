import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.model';
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { Course, CourseDocument } from 'src/courses/Schemas/course.model';
import { User, UserDocument } from 'src/users/Schemas/user.model';
import { Response } from 'express';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private CartModel: Model<CartDocument>,
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
        @InjectModel(User.name) private UserModel: Model<UserDocument>
    ) {}
    
    async addToCart(user: PartialUser, courseId: mongoose.Types.ObjectId, discount: number) {
        const course = await this.CourseModel.findById(courseId)
        if (!course || course.isDeleted) {
            throw new NotFoundException()
        }
        const existingCart = await this.CartModel.findOne({userId: user._id})
        if (existingCart) {
            let match = false            
            for (let course of existingCart.courses) {
                if (course.courseId.toString() === courseId.toString()) {
                    match = true
                    throw new ConflictException('Already Added')
                }
            }
            if (!match) {
                existingCart.courses.push({courseId, discount: discount || 0})
                if(!await existingCart.save()) {
                    throw new InternalServerErrorException('Something Went Wrong Please Try Again')
                }         
                return existingCart
            }
        }
        const cart = await this.CartModel.create({
            userId: user._id,
            courses: [{
                courseId: course._id,
                discount: discount || 0
            }]
        })
        if(!cart.save()) {
            throw new InternalServerErrorException('Something went wrong please try again')
        }
        return cart
    }

    async removeFromCart(user: PartialUser, courseId: mongoose.Types.ObjectId) {
        const cart = await this.CartModel.findOneAndUpdate({userId: user._id}, {$pull: {courses: {courseId}}}, {new: true})
        if (!cart) {
            throw new BadRequestException('Cart Is empty')
        }
        return cart
    }

    async emptyCart(user: PartialUser) {
        const cart = await this.CartModel.findOneAndDelete({userId: user._id})
        if (!cart) {
            throw new BadRequestException('Cart Is empty')
        }
        return cart
    }

    async displayCart(res: Response, user: PartialUser) {
        const cart = await this.CartModel.findOne({userId: user._id}).populate([
            {
                path: 'user',
                select: 'email username'
            },
            {
                path: 'coursesInfo'
            }
        ])
        if (!cart) return res.status(200).json({message: 'cart is empty'})
        return res.status(200).json({cart})
    }
}

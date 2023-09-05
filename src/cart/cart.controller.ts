import { Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guards/isAuth.guard';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { ObjectIdPipe } from 'src/pipes/objectId.pipe';
import mongoose, {ObjectId, Types} from 'mongoose'
import { log } from 'console';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('/cart')
export class CartController {

    constructor(private _CartService: CartService) {}

    @Post('/:courseId')
    addToCart(
        @CurrentUser() user: PartialUser, 
        @Param('courseId', ObjectIdPipe) courseId: mongoose.Types.ObjectId,
        @Query('discount', ParseIntPipe) discount: number,
    ) {
        return this._CartService.addToCart(user, courseId, discount)
    }

    @Delete('/:courseId')
    removeFromCart(
        @CurrentUser() user: PartialUser,
        @Param('courseId', ObjectIdPipe) courseId: mongoose.Types.ObjectId
    ) {
        return this._CartService.removeFromCart(user, courseId)
    }

    @Delete('/')
    emptyCart(
        @CurrentUser() user: PartialUser,
    ) {
        return this._CartService.emptyCart(user)
    }

    @Get('/')
    displayCart(
        @Res() res: Response,
        @CurrentUser() user: PartialUser
    ) {
        return this._CartService.displayCart(res, user)
    }

}

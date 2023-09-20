import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { AddCategoryDTO, UpdateCategoryDTO } from './DTO/categories.dto';
import { CategoriesService } from './categories.service';
import { AdminGuard } from 'src/guards/isAdmin.guard';
import { ObjectIdPipe } from 'src/pipes/objectId.pipe';
import mongoose from 'mongoose';

@Controller('/categories')
export class CategoriesController {
    constructor(private readonly _CategoryService: CategoriesService) {}

    @UseGuards(AdminGuard)
    @Post('/')
    addCategories(@CurrentUser() admin: PartialUser, @Body() body: AddCategoryDTO) {
        return this._CategoryService.addCategory(admin, body)
    }

    @UseGuards(AdminGuard)
    @Patch('/:categoryId')
    updateCategory(
        @CurrentUser() admin: PartialUser,
        @Param('categoryId', ObjectIdPipe) id: mongoose.Types.ObjectId,
        @Body() body: UpdateCategoryDTO
    ) {
        return this._CategoryService.updateCategory(admin, id, body)
    }

    @UseGuards(AdminGuard)
    @Delete('/:categoryId')
    deleteCategory(@Param('catgoryId', ObjectIdPipe) id: mongoose.Types.ObjectId) {
        return this._CategoryService.deleteCategory(id)
    }

    @Get('/all')
    getAllCategories() {
        return this._CategoryService.allCategories()
    }
}

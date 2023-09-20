import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './Schemas/category.model';
import mongoose, { Model } from 'mongoose';
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { AddCategoryDTO, UpdateCategoryDTO } from './DTO/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>
    ) {}

    async addCategory(admin: PartialUser, {name}: AddCategoryDTO): Promise<Category> {
        const existsCategory = await this.CategoryModel.findOne({name})
        if (existsCategory) {
            throw new ConflictException('This Category Already Exist')
        }
        const category = await this.CategoryModel.create({name, createdBy: admin._id})
        if (!category) {
            throw new InternalServerErrorException()
        }
        return category
    }

    async updateCategory(admin: PartialUser, id: mongoose.Types.ObjectId, {name}: UpdateCategoryDTO): Promise<Category> {
        const category = await this.CategoryModel.findById(id)
        if (!category) {
            throw new NotFoundException('Category Not Found')
        }
        category.name = name
        category.updatedBy = admin._id
        if (!await category.save()) {
            throw new InternalServerErrorException()
        }
        return category
    }

    async deleteCategory(id: mongoose.Types.ObjectId): Promise<Category> {
        const category = await this.CategoryModel.findByIdAndDelete(id)
        if (!category) {
            throw new NotFoundException('Category Not Found')
        }
        return category
    }

    async allCategories(): Promise<Category[]> {
        const categories = await this.CategoryModel.find()
        if (!categories) {
            throw new InternalServerErrorException()
        }
        return categories
    }
}

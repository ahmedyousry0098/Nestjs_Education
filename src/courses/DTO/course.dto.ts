import {IsString, IsNumber, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsPositive, IsMongoId} from 'class-validator'
import {Expose, Exclude, Transform} from 'class-transformer'
import mongoose, { ObjectId } from 'mongoose'
import { Iimage } from 'src/interfaces/image'

export class CourseResponseDto {

}

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @Transform((price) => parseInt(price.value))
    price: number

    @IsMongoId({message: 'In-valid Category ID'})
    categoryId: mongoose.Types.ObjectId

}

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    name: string

    @IsNumber()
    @IsOptional()
    @Transform((price) => parseInt(price.value))
    price: number
}
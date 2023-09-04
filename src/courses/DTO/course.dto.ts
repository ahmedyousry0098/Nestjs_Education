import {IsString, IsNumber, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsPositive} from 'class-validator'
import {Expose, Exclude, Transform} from 'class-transformer'
import { ObjectId } from 'mongoose'
import { Iimage } from 'src/intefaces/image'

export class CourseResponseDto {

}

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @Transform((price) => parseInt(price.value))
    price: number
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
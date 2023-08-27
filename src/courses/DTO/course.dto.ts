import {IsString, IsNumber, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsPositive} from 'class-validator'
import {Expose, Exclude, Transform} from 'class-transformer'
import { ObjectId } from 'mongoose'
import { Iimage } from 'src/intefaces/image'

export class CourseResponseDto {

    @Expose()
    _id: ObjectId

    @Expose()
    name: string
    
    @Expose()
    description: string
    
    @Expose()
    price: number

    @Expose()
    img: Iimage

    @Exclude()
    isDeleted: boolean

    @Exclude()
    enrolledBy: ObjectId[]
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
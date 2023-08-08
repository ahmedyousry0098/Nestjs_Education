import {IsString, IsNumber, IsNotEmpty, IsArray, IsOptional, IsBoolean} from 'class-validator'
import {Expose, Exclude} from 'class-transformer'
import { ObjectId } from 'mongoose'

export class CourseResponseDto {
    @Expose()
    name: string
    
    @Expose()
    description: string
    
    @Expose()
    price: number

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
    price: number

    @IsOptional()
    @IsArray()
    enrolledBy: ObjectId[]

    @IsBoolean() 
    isDeleted: boolean = false
}

export class FindCourseDto {
    

}
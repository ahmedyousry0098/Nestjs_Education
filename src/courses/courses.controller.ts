import {Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, UseInterceptors} from '@nestjs/common'
import { Response } from 'express';
import { CourseService } from './courses.service';
import { ObjectId } from 'mongoose';
import { CreateCourseDto, CourseResponseDto } from './DTO/course.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@UseInterceptors(new SerializeInterceptor(CourseResponseDto))
@Controller('/course')
export class CourseController {
    constructor(private _CourseService: CourseService) {}

    @Get('/:id')
    findCourse(@Param('id') id: ObjectId) {
        return this._CourseService.findCourseById(id)
    }

    @Get('/')
    findAllCourses() {
        return this._CourseService.findAllCourses()
    }

    @Post('/')
    createCourse(@Body() body: CreateCourseDto) {
        return this._CourseService.createCourse(body)
    }
}
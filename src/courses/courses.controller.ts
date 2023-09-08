import {
    Controller, 
    UseInterceptors,
    Get, 
    Post, 
    Put, 
    Patch, 
    Delete, 
    Body, 
    Query,
    Param, 
    UploadedFile,
    NotFoundException,
    ParseFilePipe,
    FileTypeValidator,
    UseGuards, 
} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import { Response } from 'express';
import { CourseService } from './services/courses.service';
import { CreateCourseDto, CourseResponseDto, UpdateCourseDto } from './DTO/course.dto';
import { FindDTO } from 'src/utils/apiFeatures';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { isInstructor } from 'src/guards/isInstructor.guard';
import { PartialUser } from 'src/interfaces/curren-user.interface';
import { ObjectIdPipe } from 'src/pipes/objectId.pipe';
import mongoose from 'mongoose';

@Controller('/courses')
export class CourseController {
    constructor(private _CourseService: CourseService) {}

    @UseGuards(isInstructor)
    @UseInterceptors(FileInterceptor('img'))
    @Post('/')
    createCourse(
        @Body() body: CreateCourseDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image/*'})
                ]
            }),
            ) img: Express.Multer.File,
        @CurrentUser() instructor: PartialUser
    ) {
        return this._CourseService.createCourse(body, img, instructor)
    }

    @UseGuards(isInstructor)
    @UseInterceptors(FileInterceptor('img'))
    @Put('/:courseId')
    updateCourse (
        @Param('courseId', ObjectIdPipe) courseId: mongoose.Types.ObjectId,
        @Body() body: UpdateCourseDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: 'image/*'})
                ],
                fileIsRequired: false
            })
        ) img: Express.Multer.File,
        @CurrentUser() instructor: PartialUser
    ) {
        return this._CourseService.updateCourse(
            courseId, 
            body,
            img,
            instructor
        )
    }

    @Delete('/:courseId')
    deleteCourse(@Param('courseId', ObjectIdPipe) courseId: mongoose.Types.ObjectId, @CurrentUser() user: PartialUser) {
        return this._CourseService.deleteCourse(courseId, user)
    }

    @Get('/')
    findAllCourses(@Query() query: FindDTO) {
        return this._CourseService.findAllCourses(query)
    }

    @Get('/:id')
    findCourse(@Param('id', ObjectIdPipe) id: mongoose.Types.ObjectId) {
        return this._CourseService.findCourse(id)
    }
}
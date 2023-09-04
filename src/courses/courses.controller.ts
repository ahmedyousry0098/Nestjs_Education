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
import { CourseService } from './courses.service';
import { ObjectId } from 'mongoose';
import { CreateCourseDto, CourseResponseDto, UpdateCourseDto } from './DTO/course.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AdminGuard } from 'src/guards/isAdmin.guard';
import { FindDTO } from 'src/utils/apiFeatures';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { isInstructor } from 'src/guards/isInstructor.guard';
import { PartialUser } from 'src/users/interfaces/curren-user.interface';

// @UseInterceptors(new SerializeInterceptor(CourseResponseDto))
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
        @Param('courseId') courseId: string,
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
    deleteCourse(@Param('courseId') courseId: string, @CurrentUser() user: PartialUser) {
        return this._CourseService.deleteCourse(courseId, user)
    }

    @Get('/')
    findAllCourses(@Query() query: FindDTO) {
        return this._CourseService.findAllCourses(query)
    }

    @Get('/:id')
    findCourse(@Param('id') id: string) {
        return this._CourseService.findCourse(id)
    }
}
import {BadRequestException, ForbiddenException, GoneException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException} from '@nestjs/common'
import { CourseRepository } from './courses.repository';
import { Model, ObjectId } from 'mongoose';
import { Course, CourseDocument } from './Schemas/course.model';
import { CreateCourseDto, UpdateCourseDto } from './DTO/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UploadService } from 'src/uploadFiles/upload.service';
import { log } from 'console';
import { generateCustomCode } from 'src/utils/customCode';
import { ApiFeatures, FindDTO } from 'src/utils/apiFeatures';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
        private _UploadService: UploadService 
    ){}
    
    async createCourse(course: CreateCourseDto, img: Express.Multer.File) {
        const {name, price} = course
        const generalId = generateCustomCode(5)
        const newCourse = new this.CourseModel({generalId, name, price})
        const {secure_url, public_id} = await this._UploadService.uploadImg(img, `${newCourse.name}${generalId}`)
        if(!public_id || !secure_url) {
            throw new ServiceUnavailableException('Cannot Upload Image, Please Try Again')
        }
        newCourse.img = {secure_url, public_id}
        if (!newCourse.save()) {
            throw new InternalServerErrorException()
        }
        return newCourse
    }
    
    async updateCourse(
        courseId: string,
        {name, price}: UpdateCourseDto,
        img: Express.Multer.File
    ) {
        const course = await this.CourseModel.findById(courseId)
        if (!course) {
            throw new NotFoundException('Course Not Found')
        }
        if (course.isDeleted) {
            throw new GoneException('Course Have been Deleted')
        }
        if (img) {
            const {public_id, secure_url} = await this._UploadService.uploadImg(img, `${course.name}${course.generalId}`)
            if (!public_id || !secure_url) {
                throw new ServiceUnavailableException('Cannot Update Image')
            }
            course.img = {public_id, secure_url}
        }
        if (name) course.name = name;
        if (price) course.price = price

        if (!course.save()) {
            throw new InternalServerErrorException()
        }
        return course
    }

    async findAllCourses(query: FindDTO) {
        const mongooseQuery = this.CourseModel.find({})
        const procQuery = new ApiFeatures(mongooseQuery, query).pagination().search().filter()
        const courses = await procQuery.mongooseQuery
        if (!courses.length) return 'No Courses Available'
        if (!courses) throw new NotFoundException()
        return courses
    }

    async findCourse(id: string) {
        const course = await this.CourseModel.findById(id)
        if (!course) {
            throw new BadRequestException('Content not available')
        }
        return course
    }
}

import {BadRequestException, ForbiddenException, GoneException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException, UnauthorizedException} from '@nestjs/common'
import { CourseRepository } from '../courses.repository';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Course, CourseDocument } from '../Schemas/course.model';
import { CreateCourseDto, UpdateCourseDto } from '../DTO/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UploadService } from 'src/uploadFiles/upload.service';
import { log } from 'console';
import { generateCustomCode } from 'src/utils/customCode';
import { ApiFeatures, FindDTO } from 'src/utils/apiFeatures';
import { PartialUser } from 'src/interfaces/curren-user.interface'; 

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
        private _UploadService: UploadService 
    ){}
    
    async createCourse(course: CreateCourseDto, img: Express.Multer.File, instructor: PartialUser) {
        const {name, price} = course
        const newCourse = new this.CourseModel({name, price, instructorId: instructor._id})
        const {secure_url, public_id} = await this._UploadService.uploadImg(img, `${newCourse.name}${newCourse.generalId}`)
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
        courseId: mongoose.Types.ObjectId,
        {name, price}: UpdateCourseDto,
        img: Express.Multer.File,
        instructor: PartialUser
    ) {
        const course = await this.CourseModel.findById(courseId)
        if (!course) {
            throw new NotFoundException('Course Not Found')
        }
        if (course.instructorId.toString() !== instructor._id.toString()) {
            throw new UnauthorizedException('Cannot Access other instructors courses')
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

    async deleteCourse(courseId: mongoose.Types.ObjectId, user: PartialUser) {
        const course = await this.CourseModel.findById(courseId)
        if (!course || course.isDeleted) {
            throw new BadRequestException('Course Not Found')
        }
        if (course.instructorId.toString() != user._id.toString()) {
            throw new UnauthorizedException('Cannot Delete Other Instructors Course')
        }
        const deletedCourse = await this.CourseModel.findByIdAndUpdate(courseId, {isDeleted: true}, {new: true, lean: true})
        if (!deletedCourse) throw new InternalServerErrorException('Something went wrong please try again')
        return deletedCourse
    }

    async findAllCourses(query: FindDTO) {
        const mongooseQuery = this.CourseModel.find({})
        const procQuery = new ApiFeatures(mongooseQuery, query).pagination().search().filter()
        const courses = await procQuery.mongooseQuery.populate({path: 'instructor', select: "email username"})
        if (!courses.length) return 'No Courses Available'
        if (!courses) throw new NotFoundException()
        return courses
    }

    async findCourse(id: mongoose.Types.ObjectId) {
        const course = await this.CourseModel.findById(id).populate({path: 'instructor', select: 'email username'})
        if (!course) {
            throw new BadRequestException('Content not available')
        }
        if (course.isDeleted) {
            throw new GoneException('Course Have been Deleted')
        }
        return course
    }
}

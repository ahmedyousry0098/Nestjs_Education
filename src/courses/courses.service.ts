import {Injectable, NotFoundException} from '@nestjs/common'
import { CourseRepository } from './courses.repository';
import { ObjectId } from 'mongoose';
import { Course } from './Schemas/course.model';
import { CreateCourseDto } from './DTO/course.dto';

@Injectable()
export class CourseService {
    constructor(protected readonly _CourseRepo: CourseRepository){}
    
    async findCourseById(id: ObjectId) {
        const course = await this._CourseRepo.findCourseById(id)
        if (!course) throw new NotFoundException('Course Not Found!')
        return course
    }

    async findAllCourses() {
        const courses = await this._CourseRepo.findCourses({})
        if (!courses.length) return 'No Course Added Yet!'
        if (!courses) throw new NotFoundException()
        return courses
    }

    async createCourse(course: CreateCourseDto) {
        return this._CourseRepo.createCourse(course)
    }
}
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Course, CourseDocument} from './Schemas/course.model'
import { FilterQuery, Model, ObjectId } from 'mongoose'
import { CreateCourseDto } from './DTO/course.dto'

@Injectable()
export class CourseRepository {
    constructor(@InjectModel(Course.name) private CourseModel: Model<CourseDocument>) {}

    async findCourseById(id: ObjectId): Promise<Course> {
        return this.CourseModel.findById(id)
    }

    async findOneCourse(courseFilterQuery: FilterQuery<CourseDocument>): Promise<Course> {
        return this.CourseModel.findOne(courseFilterQuery)
    }

    async findCourses(courseFilterQuery: FilterQuery<Course>): Promise<Course[]> {
        return this.CourseModel.find(courseFilterQuery)
    }

    async createCourse(course: CreateCourseDto): Promise<Course> {
        const newCourse = await this.CourseModel.create(course)
        return newCourse.save()
    }

    async findCourseAndUpdate(courseFilterQuery: FilterQuery<CourseDocument>, course: Partial<Course>) {
        return this.CourseModel.findOneAndUpdate(courseFilterQuery, course)
    }
}
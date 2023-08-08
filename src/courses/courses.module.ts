import { Module } from "@nestjs/common";
import { CourseController } from "./courses.controller";
import { CourseService } from "./courses.service";
import {MongooseModule} from '@Nestjs/mongoose'
import { Course, CourseSchema } from "./Schemas/course.model";
import { CourseRepository } from "./courses.repository";

@Module({
    imports: [MongooseModule.forFeature([{name: Course.name, schema: CourseSchema}])],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository]
})

export class CourseModule {}
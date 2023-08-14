import { Module } from "@nestjs/common";
import { CourseController } from "./courses.controller";
import { CourseService } from "./courses.service";
import {MongooseModule} from '@Nestjs/mongoose'
import { Course, CourseSchema } from "./Schemas/course.model";
import { CourseRepository } from "./courses.repository";
import { User, UserSchema } from "src/users/Schemas/user.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Course.name, schema: CourseSchema},
            {name: User.name, schema: UserSchema}
        ]),
    ],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository]
})

export class CourseModule {}
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { CourseController } from "./courses.controller";
import { CourseService } from "./services/courses.service";
import {MongooseModule} from '@nestjs/mongoose'
import { Course, CourseSchema } from "./Schemas/course.model";
import { CourseRepository } from "./courses.repository";
import { User, UserSchema } from "src/users/Schemas/user.model";
import {} from 'cloudinary'
import { UploadService } from "src/uploadFiles/upload.service";
import { CurrentUserMiddleware } from "src/middlewares/current-user.middleware";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Course.name, schema: CourseSchema},
            {name: User.name, schema: UserSchema}
        ]),
    ],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository, UploadService]
})

export class CourseModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CurrentUserMiddleware)
            .forRoutes(
                {path: "/courses", method: RequestMethod.POST},
                {path: "/courses", method: RequestMethod.PUT},
                {path: "/courses/*", method: RequestMethod.PATCH}
            )
    }
}
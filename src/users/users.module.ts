import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core'
import { AuthenticationService } from './services/authentication.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schemas/user.model';
import {hashSync} from 'bcrypt'
import {JwtModule} from '@nestjs/jwt'
import {MailModule} from '../mail/mail.module'
import { ProfileService } from './services/profile.service';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';
import { UsersService } from './services/users.service';
import { Course, CourseSchema } from 'src/courses/Schemas/course.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [{
        name: User.name,
        useFactory: () => {
          let schema = UserSchema
          schema.pre('save', function(next) {
            const user = this
            if (this.isModified('password')) {
              const saltRounds = parseInt(process.env.SALT_ROUNDS)
              user.password = hashSync(user.password, saltRounds)
              this.lastPasswordChenge = new Date() 
            }
            next()
          })
          return schema
        }
      }, {
        name: Course.name,
        useFactory: () => {
          return CourseSchema
        }
      }]
    ), 
    MailModule
  ],
  controllers: [UsersController],
  providers: [
    AuthenticationService, 
    ProfileService,
    UsersService
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes(
      {path: '/:profileId/*profile', method: RequestMethod.ALL},
      {path: '/:profileId/*password', method: RequestMethod.PATCH},
      {path: '/me', method: RequestMethod.GET},
      {path: '/myprofile', method: RequestMethod.GET}
    )
  }
}

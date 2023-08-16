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


@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [{
        name: User.name,
        useFactory: () => {
          let schema = UserSchema
          schema.pre('save', function() {
            const user = this
            const saltRounds = parseInt(process.env.SALT_ROUNDS)
            user.password = hashSync(user.password, saltRounds)
          })
          return schema
        }
      }]
    ), 
    MailModule
  ],
  controllers: [UsersController],
  providers: [
    AuthenticationService, 
    ProfileService,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes(
      {path: '/:profileId/update-profile', method: RequestMethod.PUT},
      {path: '/me', method: RequestMethod.GET}
    )
  }
}

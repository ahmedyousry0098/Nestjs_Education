import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schemas/user.model';
import {hashSync} from 'bcrypt'
import {JwtModule} from '@nestjs/jwt'


@Module({
  controllers: [UsersController],
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
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    })
  ],

  providers: [AuthenticationService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './courses/courses.module';
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigModule} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { Authentication } from './authentication/authentication';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_LINK),
    UsersModule,
    CourseModule,
    AuthModule,
    AuthenticationModule,
  ],
  controllers: [AppController, AuthController, AuthenticationController],
  providers: [AppService, Authentication, AuthenticationService],
})

export class AppModule {}
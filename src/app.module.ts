import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './courses/courses.module';
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigModule} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import {MailerModule} from '@nestjs-modules/mailer'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_LINK),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'outlook',
        secure: false,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
      defaults: {
        from: process.env.MAILER_USER
      }
    }),
    UsersModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
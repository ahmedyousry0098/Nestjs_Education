import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './courses/courses.module';
import {MongooseModule} from '@nestjs/mongoose'

@Module({
  imports: [
    CourseModule,
    MongooseModule.forRoot('mongodb+srv://ahmedyousry098:ahmedyousry098@cluster0.jttw0hz.mongodb.net/education')
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
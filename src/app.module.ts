import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './courses/courses.module';
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigModule} from '@nestjs/config'
import { UsersModule } from './users/users.module';
import {MailerModule} from '@nestjs-modules/mailer'
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './uploadFiles/upload.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';

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
        service: 'gmail',
        secure: false,
        auth: {
          user: process.env.G_MAILER_USER,
          pass: process.env.G_MAILER_PASS,
        },
        tls: {rejectUnauthorized: false},
      },
      defaults: {
        from: process.env.MAILER_USER,
      }
    }),
    UsersModule,
    CourseModule,
    UploadModule,
    CartModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
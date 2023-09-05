import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.model';
import { User, UserSchema } from 'src/users/Schemas/user.model';
import { Course, CourseSchema } from 'src/courses/Schemas/course.model';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Cart.name, schema: CartSchema},
      {name: User.name, schema: UserSchema},
      {name: Course.name, schema: CourseSchema}
    ])
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes(
        {path: '/cart/*', method: RequestMethod.ALL}
      )
  }
}

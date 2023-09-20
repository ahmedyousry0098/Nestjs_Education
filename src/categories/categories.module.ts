import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './Schemas/category.model';
import { User, UserSchema } from 'src/users/Schemas/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Category.name, schema: CategorySchema},
      {name: User.name, schema: UserSchema}
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes(
        {path: '/categories/*', method: RequestMethod.ALL}
      )
  }
}

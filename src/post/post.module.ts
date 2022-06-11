import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { CategorySchema } from './models/category.model';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './controllers/category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    CategoryService,
    PostRepository,
    CategoryRepository,
  ],
})
export class PostModule {}

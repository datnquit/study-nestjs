import { CacheModule, Global, Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { CategorySchema } from './models/category.model';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './controllers/category.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './handler/createPost.handler';
import { GetPostHandler } from './handler/getPost.handler';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 10,
      max: 100,
    }),
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
    CqrsModule,
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    CategoryService,
    PostRepository,
    CategoryRepository,
    CreatePostHandler,
    GetPostHandler,
  ],
  exports: [PostService],
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.model';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}

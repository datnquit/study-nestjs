import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';
import { User } from '../../user/models/user.model';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllPosts() {
    return this.postRepository.getByCondition({});
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post.populate('user').execPopulate();
      return post;
    } else {
      // throw new PostNotFoundException(post_id);
      throw new NotFoundException(`Post with id ${post_id} not found`);
    }
  }

  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }

  async createPost(user: User, post: CreatePostDto) {
    post.user = user._id;
    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }
    return new_post;
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async getByCategories(category_ids: [string]) {
    return await this.postRepository.getByCondition({
      categories: {
        $all: category_ids,
      },
    });
  }

  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }

  async getByArray() {
    // return await this.postRepository.getByCondition({
    //   tags: ['red', 'blank'],
    // });
    // return await this.postRepository.getByCondition({
    //   tags: { $all: ['red', 'blank'] },
    // });
    // return await this.postRepository.getByCondition({
    //   tags: 'red',
    // });
    // return await this.postRepository.getByCondition({
    //   numbers: { $gt: 20 },
    // });
    // return await this.postRepository.getByCondition({
    //   numbers: { $gt: 15, $lt: 20 },
    // });
    // return await this.postRepository.getByCondition({
    //   numbers: { $elemMatch: { $gt: 20, $lt: 30 } },
    // });
    // return await this.postRepository.getByCondition({
    //   'numbers.0': { $gt: 10 },
    // });
    return await this.postRepository.getByCondition({
      tags: { $size: 3 },
    });
  }
}

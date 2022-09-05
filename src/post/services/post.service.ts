import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';
import { User } from '../../user/models/user.model';
import { CategoryRepository } from '../repositories/category.repository';
import { isValidObjectId } from 'mongoose';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllPosts(start: string, page: number, limit: number) {
    const count = await this.postRepository.countDocuments({});
    const count_page = (count / limit).toFixed();
    const posts = await this.postRepository.getByCondition(
      {
        _id: {
          $gt: isValidObjectId(start) ? start : '000000000000000000000000',
        },
      },
      null,
      {
        sort: {
          _id: 1,
        },
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      },
    );
    return { count_page, posts };
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      // await post
      //   .populate('user', 'name -_id')
      //   .populate('categories', 'title')
      //   .execPopulate();
      // await post
      //   .populate({ path: 'user' })
      //   .populate({ path: 'categories' })
      //   .execPopulate();
      // await post
      //   .populate([{ path: 'user' }, { path: 'categories' }])
      //   .execPopulate();
      // await post
      //   .populate({
      //     path: 'categories',
      //     match: { _id: '62a45f081fa1129c58dd4201' },
      //     select: 'title',
      //     options: { limit: 1 },
      //     populate: {
      //       path: 'posts',
      //     },
      //   })
      //   .execPopulate();
      await post.populate('category').execPopulate();
      // console.log(post.populated('user'));
      // console.log(post.depopulate('user'));
      // console.log(post.populated('user'));

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

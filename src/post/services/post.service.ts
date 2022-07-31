import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { PostNotFoundException } from '../exceptions/postNotFound.exception';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getAllPosts() {
    return this.postRepository.getByCondition({});
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);

    if (post) {
      return post;
    } else {
      throw new NotFoundException(post_id);
      // throw new PostNotFoundException(post_id);
    }
    // throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }

  async createPost(post: CreatePostDto) {
    return await this.postRepository.create(post);
  }

  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }
}

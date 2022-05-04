import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, FindPostDto, UpdatePostDto } from './dto/post.dto';
import { ExceptionLoggerFilter } from '../utils/exceptionLogger.filter';
import { HttpExceptionFilter } from '../utils/httpException.filter';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  // @UseFilters(ExceptionLoggerFilter)
  @UseFilters(HttpExceptionFilter)
  async getPostById(@Param() { id }: FindPostDto) {
    return await this.postService.getPostById(id);
  }

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postService.createPost(post);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return true;
  }
}

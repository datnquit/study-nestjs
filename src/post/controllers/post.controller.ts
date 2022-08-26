import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  FindPostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { ExceptionLoggerFilter } from '../../utils/exceptionLogger.filter';
import { HttpExceptionFilter } from '../../utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  getAllPosts(@Query() { start, page, limit }: PaginationPostDto) {
    return this.postService.getAllPosts(start, page, limit);
  }

  @Get(':id')
  // @UseFilters(ExceptionLoggerFilter)
  @UseFilters(HttpExceptionFilter)
  async getPostById(@Param() { id }: FindPostDto) {
    return await this.postService.getPostById(id);
  }

  @Get(':id/get-by-query')
  async getDetailPostByQuery(@Param() { id }: FindPostDto) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-by-command')
  async createByCommand(@Req() req: any, @Body() post: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(req.user, post));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user.populate('posts').execPopulate();
    return req.user.posts;
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

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_ids') category_ids) {
    return await this.postService.getByCategories(category_ids);
  }

  @Get('get/array')
  async getByArray() {
    return await this.postService.getByArray();
  }
}

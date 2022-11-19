import {
  Body,
  CACHE_MANAGER,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreatePostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { ExceptionLoggerFilter } from '../../utils/exceptionLogger.filter';
import { HttpExceptionFilter } from '../../utils/httpException.filter';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';
import { Cache } from 'cache-manager';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getAllPost(@Query() { page, limit, start }: PaginationPostDto) {
    return this.postService.getAllPosts(page, limit, start);
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  // @UseFilters(ExceptionLoggerFilter)
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get(':id/get-with-cache')
  @UseInterceptors(CacheInterceptor)
  async getPostDetailWithCache(@Param('id') id: string) {
    console.log('Run here');
    return (await this.postService.getPostById(id)).toJSON();
  }

  @Get('cache/demo/set-cache')
  async demoSetCache() {
    await this.cacheManager.set('newnet', 'hello world', { ttl: 60 * 10 });
    return true;
  }

  @Get('cache/demo/get-cache')
  async demoGetCache() {
    return this.cacheManager.get('newnet');
  }

  @Get(':id/get-by-query')
  async getDetailByQuery(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createByCommand(@Req() req: any, @Body() post: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(req.user, post));
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

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user
      .populate({
        path: 'posts',
        // select: 'title',
      })
      .execPopulate();
    return req.user.posts;
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
    return this.postService.getByArray();
  }
}

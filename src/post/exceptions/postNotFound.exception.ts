import { HttpException, HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends HttpException {
  constructor(postId: string) {
    super(`Post with id ${postId} not found`, HttpStatus.NOT_FOUND);
  }
}

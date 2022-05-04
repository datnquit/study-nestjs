import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(post_id: string) {
    super(`Post with id ${post_id} not found`);
  }
}

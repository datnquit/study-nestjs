import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepository } from '../repositories/post.repository';
import { GetPostQuery } from '../queries/getPost.query';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements ICommandHandler<GetPostQuery> {
  constructor(private postRepository: PostRepository) {}

  async execute(command: GetPostQuery) {
    return await this.postRepository.findById(command.post_id);
  }
}

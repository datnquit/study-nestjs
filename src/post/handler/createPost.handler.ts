import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { PostRepository } from '../repositories/post.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private postRepository: PostRepository) {}

  async execute(command: CreatePostCommand) {
    command.createPostDto.user = command.user._id;
    return await this.postRepository.create(command.createPostDto);
  }
}

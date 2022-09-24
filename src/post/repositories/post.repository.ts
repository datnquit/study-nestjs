import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../base.repository';
import { Post } from '../models/post.model';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<Post>,
  ) {
    super(postModel);
  }

  async countDocuments(filter) {
    return this.postModel.countDocuments(filter);
  }
}

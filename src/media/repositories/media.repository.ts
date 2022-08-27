import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from '../models/media.model';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class MediaRepository extends BaseRepository<Media> {
  constructor(
    @InjectModel('Media')
    private readonly mediaModel: Model<Media>,
  ) {
    super(mediaModel);
  }
}

import {
  Post,
  UseInterceptors,
  UploadedFile,
  Controller,
  UploadedFiles,
  Get,
  Body,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../services/media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('access')
  async getLinkAccess(@Query('key') key: string) {
    const url = this.mediaService.getLinkMediaKey(key);
    return {
      url: url,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    return await this.mediaService.upload(file);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadedFiles() files) {
    const medias = [];
    for (const item of files) {
      medias.push(await this.mediaService.upload(item));
    }
    return medias;
  }

  @Put('update-acl')
  async updateAcl(@Body('media_id') media_id: string) {
    return await this.mediaService.updateACL(media_id);
  }

  @Delete('delete')
  async delete(@Query('media_id') media_id: string) {
    await this.mediaService.deleteFileS3(media_id);
    return true;
  }
}

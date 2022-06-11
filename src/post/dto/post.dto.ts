import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty() title: string;
  description: string;
  content: string;
  user: string;
  categories: [string];
}

export class UpdatePostDto {
  @IsNotEmpty() title: string;
  description: string;
  content: string;
}

export class FindPostDto {
  @IsMongoId() id;
}

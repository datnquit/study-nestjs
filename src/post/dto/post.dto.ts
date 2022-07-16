import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

export class PaginationPostDto {
  @IsNotEmpty()
  start?: string;

  @IsNotEmpty()
  page?: number;

  @IsNotEmpty()
  limit?: number;
}

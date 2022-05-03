import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() name: string;
  @IsNotEmpty() password: string;
}

export class LoginUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() password: string;
}

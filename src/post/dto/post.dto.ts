export class CreatePostDto {
  content: string;
  title: string;
}

export class UpdatePostDto {
  id: number;
  content: string;
  title: string;
}

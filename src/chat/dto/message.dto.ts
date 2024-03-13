import { IsString, IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}

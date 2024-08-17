import { IsString, IsIn, IsEnum } from 'class-validator';

export class ConvertImageDto {
  @IsString()
  @IsIn(['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp'])
  format: string;

  @IsEnum(['base64', 'binary'])
  responseFormat: 'base64' | 'binary';
}

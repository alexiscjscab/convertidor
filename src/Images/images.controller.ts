import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import chalk from 'chalk';
import { ImageService } from './images.service';
import { red } from 'colorette';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('convert')
  @ApiOperation({
    summary: 'Convert image to specified format and response type',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The image file to be converted',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image converted successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid image format or conversion error.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async convertImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('format') format: string,
    @Query('responseFormat') responseFormat: 'base64' | 'binary',
    @Res() res: Response,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const validFormats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp'];
    if (!validFormats.includes(format)) {
      throw new BadRequestException('Invalid format specified.');
    }

    if (!['base64', 'binary'].includes(responseFormat)) {
      throw new BadRequestException('Invalid response format specified.');
    }

    try {
      const convertedImage = await this.imageService.convertImage(
        file.buffer,
        format,
      );

      if (responseFormat === 'base64') {
        const base64Image = convertedImage.toString('base64');
        const imageUrl = `data:image/${format};base64,${base64Image}`;
        res.status(HttpStatus.OK).json({
          message: 'Image converted successfully.',
          imageUrl: imageUrl,
        });
      } else {
        res.setHeader('Content-Type', `image/${format}`);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=image.${format}`,
        );
        res.status(HttpStatus.OK).send(convertedImage);
      }
    } catch (error) {
      console.error(red('Conversion Error:'), red(error.message));
      throw new BadRequestException('Image conversion error.');
    }
  }
}

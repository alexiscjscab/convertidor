import { Controller, Post, UploadedFiles, UseInterceptors, Query, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('convert')
  @ApiOperation({ summary: 'Convert multiple images to a PDF' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The images to be converted',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Images converted to PDF successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid image format or conversion error.' })
  @UseInterceptors(FilesInterceptor('files', 10))  // El número '10' es el máximo de archivos permitidos.
  async convertImagesToPdf(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded.');
      }

      const pdfBuffer = await this.pdfService.convertImagesToPdf(files.map(file => file.buffer));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      console.error('Error converting images to PDF:', error.message);
      throw new BadRequestException(`Error converting images to PDF: ${error.message}`);
    }
  }
}

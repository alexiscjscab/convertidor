import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async convertImage(buffer: Buffer, format: string): Promise<Buffer> {
    try {
      // Verificar si el formato es válido
      const validFormats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp'];
      if (!validFormats.includes(format)) {
        throw new BadRequestException('Unsupported image format.');
      }

      // Crear la instancia de sharp
      let image = sharp(buffer);

      // Aplicar el formato solicitado
      switch (format) {
        case 'jpg':
          image = image.jpeg();
          break;
        case 'png':
          image = image.png();
          break;
        case 'gif':
          image = image.gif();
          break;
        case 'webp':
          image = image.webp();
          break;
        case 'tiff':
          image = image.tiff();
          break;
      }

      // Convertir la imagen al buffer
      return await image.toBuffer();
    } catch (error) {
      // Manejar errores específicos de sharp
      throw new BadRequestException('Unexpected error during image conversion: ' + error.message);
    }
  }
}

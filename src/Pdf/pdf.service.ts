import { Injectable, BadRequestException } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';
import * as sharp from 'sharp';

@Injectable()
export class PdfService {
  async convertImagesToPdf(imagesBuffers: Buffer[]): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.create();

      const margin = 50; // Ajuste del margen (en puntos)

      for (const imageBuffer of imagesBuffers) {
        // Convertir la imagen a JPEG para asegurar compatibilidad
        const imageJpegBuffer: Buffer = await sharp(imageBuffer).jpeg().toBuffer();

        const image = await pdfDoc.embedJpg(imageJpegBuffer);
        const page = pdfDoc.addPage();

        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Calcular las proporciones de la imagen
        const imageWidth = image.width;
        const imageHeight = image.height;
        const aspectRatio = imageWidth / imageHeight;

        // Calcular el tamaño de la imagen dentro de la página con márgenes
        let displayWidth = pageWidth - margin * 2;
        let displayHeight = displayWidth / aspectRatio;

        if (displayHeight > pageHeight - margin * 2) {
          displayHeight = pageHeight - margin * 2;
          displayWidth = displayHeight * aspectRatio;
        }

        const x = (pageWidth - displayWidth) / 2;
        const y = (pageHeight - displayHeight) / 2;

        // Dibujar la imagen con márgenes
        page.drawImage(image, {
          x,
          y,
          width: displayWidth,
          height: displayHeight,
        });

        // Opción: Dibujar un borde alrededor de la imagen (opcional)
        page.drawRectangle({
          x,
          y,
          width: displayWidth,
          height: displayHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }
      
      // Guardar el PDF y devolverlo como Buffer
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error converting images to PDF:', error.message);
      throw new BadRequestException(`Error converting images to PDF: ${error.message}`);
    }
  }
}

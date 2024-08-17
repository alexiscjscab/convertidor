import { Module } from '@nestjs/common';
import { ImageModule } from './Images/images.module';
import { PdfModule } from './Pdf/pdf.module';

@Module({
  imports: [ImageModule, PdfModule],
})
export class AppModule {}

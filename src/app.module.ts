import { Module } from '@nestjs/common';
import { ImageModule } from './Images/images.module';
import { PdfModule } from './Pdf/pdf.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImageModule,
    PdfModule,
  ],
})
export class AppModule {}

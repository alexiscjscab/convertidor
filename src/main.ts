import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { blue, green, yellow } from 'colorette';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8080);
  const environment = configService.get<string>('NODE_ENV', 'development');
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Converter API')
    .setDescription('Convert Files')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const baseUrl = environment === 'production'
    ? 'https://convertidor-production.up.railway.app'
    : `http://localhost:${port}`;

  await app.listen(port);

  if (environment !== 'test') {
    console.log(green('Nest application is running on:'));
    console.log(blue(baseUrl));
    console.log(yellow('Swagger API documentation is available at:'));
    console.log(blue(`${baseUrl}/api`));
  }
}

bootstrap();

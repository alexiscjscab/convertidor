import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { blue, green, yellow } from 'colorette';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Converter API')
    .setDescription('Converte Files')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);

  console.log(green('Nest application is running on:'));
  console.log(blue(`http://localhost:8080`));
  console.log(yellow('Swagger API documentation is available at:'));
  console.log(blue(`http://localhost:8080/api`));
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject,
  type SwaggerCustomOptions,
} from '@nestjs/swagger';

const configService: ConfigService = new ConfigService();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('OCMI')
    .setDescription('Prueba')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerCustomOptions = {
    customSiteTitle: 'OCMI',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
  await app.listen(configService.getOrThrow<string>('PORT'));
}
void bootstrap();

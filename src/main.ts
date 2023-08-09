import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await import('@adminjs/mikroorm').then(async ({ Database, Resource }) => {
        const { AdminJS } = await import('adminjs');
        return AdminJS.registerAdapter({ Database, Resource });
    });
    const config = new DocumentBuilder()
        .setTitle('NIT Archive')
        .setDescription('The NIT Archive API description')
        .setVersion('1.0')
        .addTag('course')
        .addTag('category')
        .addTag('topic')
        .addTag('video')
        .addTag('download-item')
        .addTag('rating')
        .addTag('media')
        .addTag('user')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    await app.listen(3000);
}
bootstrap();

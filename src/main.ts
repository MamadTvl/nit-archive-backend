import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from 'common/guard/role.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalGuards(new RolesGuard(new Reflector()));
    await import('@adminjs/mikroorm').then(async ({ Database, Resource }) => {
        const { AdminJS } = await import('adminjs');
        return AdminJS.registerAdapter({ Database, Resource });
    });
    const config = new DocumentBuilder()
        .setTitle('NIT Archive')
        .setDescription('The NIT Archive API description')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'apiKey',
                name: 'authorization',
                in: 'header',
            },
            'user-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
    await app.listen(3000);
}
bootstrap();

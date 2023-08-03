import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await import('@adminjs/mikroorm').then(async ({ Database, Resource }) => {
        const { AdminJS } = await import('adminjs');
        return AdminJS.registerAdapter({ Database, Resource });
    });
    await app.listen(3000);
}
bootstrap();

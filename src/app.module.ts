import {
    MiddlewareConsumer,
    Module,
    NestModule,
    OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { CourseModule } from './course/course.module';
import { MikroORM } from '@mikro-orm/core';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { VideoModule } from './video/video.module';
import { RatingModule } from './rating/rating.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { log } from 'console';
import { Course } from 'course/entities/course.entity';
import { Category } from 'category/entities/category.entity';
import { Topic } from 'topic/entities/topic.entity';
import { Video } from 'video/entities/video.entity';

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
};

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};

@Module({
    imports: [
        ConfigModule.forRoot(),
        MikroOrmModule.forRoot(),
        import('@adminjs/nestjs').then(({ AdminModule }) =>
            AdminModule.createAdminAsync({
                inject: [MikroORM],
                useFactory: (orm: MikroORM) => {
                    return {
                        adminJsOptions: {
                            rootPath: '/admin',
                            // databases: [orm],
                            resources: [
                                {
                                    resource: { model: Course, orm },
                                },
                                {
                                    resource: { model: Category, orm },
                                },
                                {
                                    resource: { model: Topic, orm },
                                },
                                {
                                    resource: { model: Video, orm },
                                },
                            ],
                        },
                        auth: {
                            authenticate,
                            cookieName: 'adminjs',
                            cookiePassword: 'secret',
                        },
                        sessionOptions: {
                            resave: true,
                            saveUninitialized: true,
                            secret: 'secret',
                        },
                    };
                },
            }),
        ),

        CourseModule,
        CategoryModule,
        TopicModule,
        VideoModule,
        RatingModule,
        MediaModule,
        UserModule,
        RoleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
    constructor(private readonly orm: MikroORM) {}

    async onModuleInit(): Promise<void> {
        const needed = await this.orm.getMigrator().checkMigrationNeeded();
        if (needed) {
            await this.orm.getMigrator().up();
        }
    }

    // for some reason the auth middlewares in profile and article modules are fired before the request context one,
    // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
    // around this issue
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MikroOrmMiddleware).forRoutes('*');
    }
}

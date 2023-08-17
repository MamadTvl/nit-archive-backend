import {
    MiddlewareConsumer,
    Module,
    NestModule,
    OnModuleInit,
} from '@nestjs/common';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { CourseModule } from './course/course.module';
import { MikroORM } from '@mikro-orm/core';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { VideoModule } from './video/video.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { Course } from 'course/entities/course.entity';
import { Category } from 'category/entities/category.entity';
import { Topic } from 'topic/entities/topic.entity';
import { Video } from 'video/entities/video.entity';
import { DownloadItemModule } from './download-item/download-item.module';
import { Role } from 'role/entities/role.entity';
import { User } from 'user/entities/user.entity';
import { DownloadItem } from 'download-item/entities/download-item.entity';
import { Rating } from 'rating/entities/rating.entity';
import { AccessToken } from 'user/entities/access-token.entity';
import { CourseStatus } from 'course/entities/course-status.entity';
import { AuthorizationMiddleware } from 'common/middleware/Authorization.middleware';
import { BullModule } from '@nestjs/bull';
import configuration from 'config/configuration';
import { UploadModule } from 'upload/upload.module';

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
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
        }),
        MikroOrmModule.forRoot(),
        BullModule.forRoot({
            prefix: 'NIT',
            redis: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                db: +process.env.REDIS_DB,
                password: process.env.REDIS_PASSWORD,
            },
        }),
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
                                {
                                    resource: { model: Role, orm },
                                },
                                {
                                    resource: { model: User, orm },
                                },
                                {
                                    resource: { model: DownloadItem, orm },
                                },
                                {
                                    resource: { model: Rating, orm },
                                },
                                {
                                    resource: { model: AccessToken, orm },
                                },
                                {
                                    resource: { model: CourseStatus, orm },
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
        UserModule,
        RoleModule,
        UploadModule,
    ],
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
        consumer.apply(AuthorizationMiddleware).forRoutes('*');
    }
}

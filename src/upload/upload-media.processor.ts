import { EntityManager } from '@mikro-orm/mysql';
import { Processor, Process } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Job } from 'bull';
import { Category } from 'category/entities/category.entity';
import { Config } from 'config/configuration';
import { CourseStatus } from 'course/entities/course-status.entity';
import { Course } from 'course/entities/course.entity';
import { randomUUID } from 'crypto';
import { DownloadItem } from 'download-item/entities/download-item.entity';
import { readFile, rm } from 'fs/promises';
import * as path from 'path';
import { User } from 'user/entities/user.entity';
import { Video } from 'video/entities/video.entity';

export type UploadMediaJob = {
    directory: string;
    originalname: string;
    model: 'course' | 'course-status' | 'category' | 'user';
    modelId: number;
    collection: 'featured' | 'cover' | 'avatar' | 'icon';
};

export type UploadVideoJob = {
    fileSrc: string;
    originalname: string;
    videoId: number;
};

export type UploadDownloadItemJob = {
    fileSrc: string;
    originalname: string;
    downloadItemId: number;
};

@Processor('upload')
export class UploadConsumer {
    constructor(
        private configService: ConfigService<Config>,
        private readonly em: EntityManager,
    ) {
        this.em = em.fork();
    }

    private getS3Instance() {
        const { accessKeyId, endpoint, secretAccessKey } =
            this.configService.get<Config['s3']>('s3');
        AWS.config.update({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            s3ForcePathStyle: true,
        });
        return new AWS.S3({
            endpoint,
        });
    }

    private async uploadToS3(file: Buffer, destination: string) {
        const { bucketName } = this.configService.get<Config['s3']>('s3');
        const s3 = this.getS3Instance();
        const data = await s3
            .upload({
                Bucket: bucketName,
                Key: destination,
                Body: file,
            })
            .promise();
        return data.Location;
    }

    private async updateUser(
        collection: 'avatar',
        modelId: number,
        locationUrl: string,
    ) {
        const ref = this.em.getReference(User, modelId);
        const course = await this.em.findOne(User, { id: modelId });
        ref.media = {
            avatarUri: course.media?.avatarUri || null,
        };
        if (collection === 'avatar') {
            ref.media.avatarUri = locationUrl;
        }
        await this.em.flush();
    }

    private async updateCourse(
        collection: 'featured' | 'cover',
        modelId: number,
        locationUrl: string,
    ) {
        const ref = this.em.getReference(Course, modelId);
        const user = await this.em.findOne(Course, { id: modelId });
        ref.media = {
            coverUri: user.media?.coverUri || null,
            featuredUri: user.media?.featuredUri || null,
        };
        if (collection === 'featured') {
            ref.media.featuredUri = locationUrl;
        }
        if (collection === 'cover') {
            ref.media.coverUri = locationUrl;
        }
        await this.em.flush();
    }

    private async updateCourseStatus(
        collection: 'icon',
        modelId: number,
        locationUrl: string,
    ) {
        if (collection !== 'icon') {
            throw new Error(`collection ${collection} does not exist`);
        }
        const ref = this.em.getReference(CourseStatus, modelId);
        ref.iconSrc = locationUrl;
        await this.em.flush();
    }

    private async updateCategory(
        collection: 'featured' | 'cover',
        modelId: number,
        locationUrl: string,
    ) {
        const ref = this.em.getReference(Category, modelId);
        const category = await this.em.findOne(Category, { id: modelId });
        ref.media = {
            coverUri: category.media?.coverUri || null,
            featuredUri: category.media?.featuredUri || null,
        };
        if (collection === 'featured') {
            ref.media.featuredUri = locationUrl;
        }
        if (collection === 'cover') {
            ref.media.coverUri = locationUrl;
        }
        await this.em.flush();
    }

    private async updateVideo(id: number, locationUrl: string) {
        const ref = this.em.getReference(Video, id);
        ref.videoFile = locationUrl;
        await this.em.flush();
    }

    private async updateDownloadItem(id: number, locationUrl: string) {
        const ref = this.em.getReference(DownloadItem, id);
        ref.url = locationUrl;
        await this.em.flush();
    }

    @Process({ concurrency: 20, name: 'media' })
    protected async uploadMedia(job: Job<UploadMediaJob>) {
        const { directory, collection, model, modelId, originalname } =
            job.data;
        const file = await readFile(directory);
        const destination = path.join(
            model,
            modelId.toString(),
            collection,
            randomUUID(),
            originalname,
        );
        await this.uploadToS3(file, destination);
        switch (model) {
            case 'category':
                if (collection === 'cover' || collection === 'featured') {
                    await this.updateCategory(collection, modelId, destination);
                }
                break;
            case 'course':
                if (collection === 'cover' || collection === 'featured') {
                    await this.updateCourse(collection, modelId, destination);
                }
                break;
            case 'course-status':
                if (collection === 'icon') {
                    await this.updateCourseStatus(
                        collection,
                        modelId,
                        destination,
                    );
                }
                break;
            case 'user':
                if (collection === 'avatar') {
                    await this.updateUser(collection, modelId, destination);
                }
                break;
        }
        await rm(directory);
    }

    @Process({ name: 'video', concurrency: 20 })
    async uploadVideo(job: Job<UploadVideoJob>) {
        const { fileSrc, originalname, videoId } = job.data;
        const file = await readFile(fileSrc);
        const destination = path.join(
            'videos',
            videoId.toString(),
            randomUUID(),
            originalname,
        );
        await this.uploadToS3(file, destination);
        await this.updateVideo(videoId, destination);
        await rm(fileSrc);
    }

    @Process({ name: 'download-item', concurrency: 20 })
    async uploadItem(job: Job<UploadDownloadItemJob>) {
        const { fileSrc, originalname, downloadItemId } = job.data;
        const file = await readFile(fileSrc);
        const destination = path.join(
            'files',
            downloadItemId.toString(),
            randomUUID(),
            originalname,
        );
        await this.uploadToS3(file, destination);
        await this.updateDownloadItem(downloadItemId, destination);
        await rm(fileSrc);
    }
}

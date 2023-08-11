import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import {
    UploadItemDto,
    UploadMediaDto,
    UploadVideoDto,
} from './dto/upload.dto';
import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import {
    UploadDownloadItemJob,
    UploadMediaJob,
    UploadVideoJob,
} from './upload-media.processor';
import { EntityManager } from '@mikro-orm/mysql';
import { Course } from 'course/entities/course.entity';
import { Category } from 'category/entities/category.entity';
import { CourseStatus } from 'course/entities/course-status.entity';
import { User } from 'user/entities/user.entity';
import { Video } from 'video/entities/video.entity';
import { DownloadItem } from 'download-item/entities/download-item.entity';

@Injectable()
export class UploadService {
    constructor(
        @InjectQueue('upload')
        private uploadQueue: Queue<
            UploadMediaJob | UploadVideoJob | UploadDownloadItemJob
        >,
        private readonly em: EntityManager,
    ) {}

    private async saveLocal(file: Express.Multer.File) {
        const directory = path.join('.nit', randomUUID());
        const location = path.resolve(directory, file.originalname);
        await mkdir(directory, { recursive: true });
        await writeFile(location, file.buffer);
        return location;
    }

    private async isModelExists(
        model: UploadMediaDto['model'] | 'video' | 'download-item',
        modelId: number,
    ) {
        try {
            switch (model) {
                case 'course':
                    await this.em.findOneOrFail(Course, { id: modelId });
                    break;
                case 'category':
                    await this.em.findOneOrFail(Category, { id: modelId });
                    break;
                case 'course-status':
                    await this.em.findOneOrFail(CourseStatus, { id: modelId });
                    break;
                case 'user':
                    await this.em.findOneOrFail(User, { id: modelId });
                    break;
                case 'video':
                    await this.em.findOneOrFail(Video, { id: modelId });
                    break;
                case 'download-item':
                    await this.em.findOneOrFail(DownloadItem, { id: modelId });
                    break;
            }
        } catch {
            return false;
        }
        return true;
    }

    async uploadMedia(data: UploadMediaDto, file: Express.Multer.File) {
        const exist = await this.isModelExists(data.model, data.modelId);
        if (!exist) {
            throw new NotFoundException();
        }
        const location = await this.saveLocal(file);
        await this.uploadQueue.add('media', {
            collection: data.collection,
            modelId: data.modelId,
            directory: location,
            model: data.model,
            originalname: file.originalname,
        });
    }

    async uploadVideo(data: UploadVideoDto, file: Express.Multer.File) {
        const exist = await this.isModelExists('video', data.videoId);
        if (!exist) {
            throw new NotFoundException();
        }
        const location = await this.saveLocal(file);
        await this.uploadQueue.add('video', {
            videoId: data.videoId,
            fileSrc: location,
            originalname: file.originalname,
        });
    }

    async uploadItem(data: UploadItemDto, file: Express.Multer.File) {
        const exist = await this.isModelExists(
            'download-item',
            data.downloadItemId,
        );
        if (!exist) {
            throw new NotFoundException();
        }
        const location = await this.saveLocal(file);
        await this.uploadQueue.add('download-item', {
            downloadItemId: data.downloadItemId,
            fileSrc: location,
            originalname: file.originalname,
        });
    }
}

import { InjectRepository } from '@mikro-orm/nestjs';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Video } from './entities/video.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { UserService } from 'user/user.service';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: EntityRepository<Video>,
        private readonly userService: UserService,
    ) {}

    async findOne(id: number) {
        try {
            const video = await this.videoRepository.findOneOrFail({ id });
            return { message: 'video found', video };
        } catch {
            throw new NotFoundException();
        }
    }

    async getVideoSrc(videoId: number, userId: number) {
        const hasAccess = await this.userService.userOwnsVideo(videoId, userId);
        if (!hasAccess) {
            throw new HttpException(
                'Subscription Required',
                HttpStatus.PAYMENT_REQUIRED,
            );
        }
        return this.videoRepository
            .findOneOrFail({ id: videoId })
            .then((video) => ({
                aparatIframe: video.aparatIframe,
                videoFile: video.videoFile,
            }))
            .catch(() => {
                throw new NotFoundException();
            });
    }
}

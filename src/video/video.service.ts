import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from './entities/video.entity';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: EntityRepository<Video>,
    ) {}

    async findOne(id: number) {
        try {
            const video = await this.videoRepository.findOneOrFail({ id });
            return video;
        } catch {
            throw new NotFoundException();
        }
    }
}

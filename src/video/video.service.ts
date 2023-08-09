import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: EntityRepository<Video>,
    ) {}

    findOne(videoId: number) {
        // return this.videoRepository.findOneOrFail({})
    }

    update(id: number, updateVideoDto: UpdateVideoDto) {
        return `This action updates a #${id} video`;
    }

    remove(id: number) {
        return `This action removes a #${id} video`;
    }
}

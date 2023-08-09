import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Video } from './entities/video.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Video])],
    controllers: [VideoController],
    providers: [VideoService],
})
export class VideoModule {}

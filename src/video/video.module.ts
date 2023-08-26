import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Video } from './entities/video.entity';
import { UserModule } from 'user/user.module';

@Module({
    imports: [MikroOrmModule.forFeature([Video]), UserModule],
    controllers: [VideoController],
    providers: [VideoService],
})
export class VideoModule {}

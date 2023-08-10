import { Controller, Get, Param } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('video')
@Controller('video')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.videoService.findOne(+id);
    }
}

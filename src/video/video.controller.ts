import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'common/guard/auth.guard';
import { Request } from 'express';
@ApiTags('video')
@Controller('video')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.videoService.findOne(id);
    }
    @ApiBearerAuth('user-auth')
    @Get('src/:id')
    @UseGuards(AuthGuard)
    findVideoSrc(@Param('id') id: number, @Req() req: Request) {
        return this.videoService.getVideoSrc(id, req.user.id);
    }
}

import { FileInterceptor } from '@nestjs/platform-express';
import {
    UploadItemDto,
    UploadMediaDto,
    UploadVideoDto,
} from './dto/upload.dto';
import { UploadService } from './upload.service';
import {
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'common/decorator/role.decorator';
import { AuthGuard } from 'common/guard/auth.guard';

@ApiTags('upload')
@Controller('upload')
@ApiBearerAuth('user-auth')
@UseGuards(AuthGuard)
@Roles()
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        // description: 'add new task',
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                    nullable: false,
                },
                model: {
                    enum: ['course', 'category', 'course-status', 'user'],
                    nullable: false,
                },
                modelId: {
                    type: 'number',
                    nullable: false,
                },
                collection: {
                    enum: ['avatar', 'featured', 'cover', 'icon'],
                    nullable: false,
                },
            },
        },
    })
    @Post('media')
    @UseInterceptors(FileInterceptor('image'))
    async uploadMedia(
        @Body() body: UploadMediaDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 200 * 1000 }),
                    new FileTypeValidator({ fileType: 'image/*' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        await this.uploadService.uploadMedia(body, file);
        return {
            message: 'file uploaded',
            body,
        };
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        // description: 'add new task',
        schema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    format: 'binary',
                    nullable: false,
                },
                videoId: {
                    type: 'number',
                    nullable: false,
                },
            },
        },
    })
    @Post('video')
    @UseInterceptors(FileInterceptor('video'))
    async uploadVideo(
        @Body() body: UploadVideoDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: Infinity }),
                    new FileTypeValidator({ fileType: /.*(.mp4)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        await this.uploadService.uploadVideo(body, file);
        return {
            message: 'file uploaded',
            body,
        };
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        // description: 'add new task',
        schema: {
            type: 'object',
            properties: {
                item: {
                    type: 'string',
                    format: 'binary',
                    nullable: false,
                },
                downloadItemId: {
                    type: 'number',
                    nullable: false,
                },
            },
        },
    })
    @Post('download-item')
    @UseInterceptors(FileInterceptor('item'))
    async uploadItem(
        @Body() body: UploadItemDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: Infinity }),
                    new FileTypeValidator({ fileType: /.*/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        await this.uploadService.uploadItem(body, file);
        return {
            message: 'file uploaded',
            body,
        };
    }
}

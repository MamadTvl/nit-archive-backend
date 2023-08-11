import { IsIn, IsNumberString } from 'class-validator';

export class UploadMediaDto {
    @IsIn(['course', 'category', 'course-status', 'user'])
    model: 'course' | 'category' | 'course-status' | 'user';

    @IsNumberString()
    modelId: number;

    @IsIn(['avatar', 'featured', 'cover', 'icon'])
    collection: 'avatar' | 'featured' | 'cover' | 'icon';
}

export class UploadVideoDto {
    @IsNumberString()
    videoId: number;
}

export class UploadItemDto {
    @IsNumberString()
    downloadItemId: number;
}

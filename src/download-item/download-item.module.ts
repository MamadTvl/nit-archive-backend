import { Module } from '@nestjs/common';
import { DownloadItemService } from './download-item.service';

@Module({
    providers: [DownloadItemService],
})
export class DownloadItemModule {}

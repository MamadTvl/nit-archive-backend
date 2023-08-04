import { Module } from '@nestjs/common';
import { DownloadItemService } from './download-item.service';
import { DownloadItemController } from './download-item.controller';

@Module({
    controllers: [DownloadItemController],
    providers: [DownloadItemService],
})
export class DownloadItemModule {}

import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { BullModule } from '@nestjs/bull';
import { UploadController } from './upload.controller';
import { UploadConsumer } from './upload-media.processor';

@Module({
    controllers: [UploadController],
    imports: [
        BullModule.registerQueue({
            name: 'upload',
            settings: {
                maxStalledCount: 100,
            },
            defaultJobOptions: {
                removeOnComplete: true,
                attempts: 100,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            },
        }),
    ],
    providers: [UploadService, UploadConsumer],
    exports: [UploadService],
})
export class UploadModule {}

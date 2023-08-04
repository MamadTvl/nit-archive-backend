import { Test, TestingModule } from '@nestjs/testing';
import { DownloadItemController } from './download-item.controller';
import { DownloadItemService } from './download-item.service';

describe('DownloadItemController', () => {
    let controller: DownloadItemController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DownloadItemController],
            providers: [DownloadItemService],
        }).compile();

        controller = module.get<DownloadItemController>(DownloadItemController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

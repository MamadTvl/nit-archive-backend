import { Test, TestingModule } from '@nestjs/testing';
import { DownloadItemService } from './download-item.service';

describe('DownloadItemService', () => {
    let service: DownloadItemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DownloadItemService],
        }).compile();

        service = module.get<DownloadItemService>(DownloadItemService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

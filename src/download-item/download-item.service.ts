import { Injectable } from '@nestjs/common';
import { CreateDownloadItemDto } from './dto/create-download-item.dto';
import { UpdateDownloadItemDto } from './dto/update-download-item.dto';

@Injectable()
export class DownloadItemService {
    create(createDownloadItemDto: CreateDownloadItemDto) {
        return 'This action adds a new downloadItem';
    }

    findAll() {
        return `This action returns all downloadItem`;
    }

    findOne(id: number) {
        return `This action returns a #${id} downloadItem`;
    }

    update(id: number, updateDownloadItemDto: UpdateDownloadItemDto) {
        return `This action updates a #${id} downloadItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} downloadItem`;
    }
}

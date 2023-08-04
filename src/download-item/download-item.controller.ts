import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { DownloadItemService } from './download-item.service';
import { CreateDownloadItemDto } from './dto/create-download-item.dto';
import { UpdateDownloadItemDto } from './dto/update-download-item.dto';

@Controller('download-item')
export class DownloadItemController {
    constructor(private readonly downloadItemService: DownloadItemService) {}

    @Post()
    create(@Body() createDownloadItemDto: CreateDownloadItemDto) {
        return this.downloadItemService.create(createDownloadItemDto);
    }

    @Get()
    findAll() {
        return this.downloadItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.downloadItemService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateDownloadItemDto: UpdateDownloadItemDto,
    ) {
        return this.downloadItemService.update(+id, updateDownloadItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.downloadItemService.remove(+id);
    }
}

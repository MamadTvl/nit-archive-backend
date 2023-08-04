import { PartialType } from '@nestjs/mapped-types';
import { CreateDownloadItemDto } from './create-download-item.dto';

export class UpdateDownloadItemDto extends PartialType(CreateDownloadItemDto) {}

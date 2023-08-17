import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';

@Module({
    providers: [TopicService],
})
export class TopicModule {}

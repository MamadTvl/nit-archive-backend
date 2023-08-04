import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Topic } from '../../topic/entities/topic.entity';

@Entity({ tableName: 'download_items' })
export class DownloadItem {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property()
    title: string;

    @Property()
    url: string;

    @ManyToOne(() => Topic, { fieldName: 'topic_id' })
    topic: Topic;

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({
        type: 'timestamp',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt: Date;
}

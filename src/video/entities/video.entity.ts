import {
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Topic } from '../../topic/entities/topic.entity';

@Entity({ tableName: 'videos' })
export class Video {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ type: 'varchar', nullable: true })
    title: string | null;

    @Property({ type: 'varchar', nullable: true, hidden: true })
    videoFile: string | null;

    @Property({ type: 'varchar', nullable: true, hidden: true })
    aparatIframe: string | null;

    @Property({ default: 0 })
    length: number;

    @ManyToOne(() => Topic, { fieldName: 'topic_id' })
    topic: Topic;

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date() })
    updatedAt: Date;
}

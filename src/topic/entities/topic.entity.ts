import {
    Collection,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Course } from '../../course/entities/course.entity';
import { Video } from '../../video/entities/video.entity';
import { DownloadItem } from '../../download-item/entities/download-item.entity';

@Entity({ tableName: 'topics' })
export class Topic {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ type: 'varchar' })
    title: string;

    @ManyToMany(() => Course, (course) => course.topics)
    courses = new Collection<Course>(this);

    @OneToMany(() => Video, (video) => video.topic)
    videos = new Collection<Video>(this);

    @OneToMany(() => DownloadItem, (item) => item.topic)
    downloadItems = new Collection<DownloadItem>(this);

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({
        type: 'timestamp',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt: Date;
}

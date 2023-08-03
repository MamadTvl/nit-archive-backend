import {
    Collection,
    Entity,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Course } from '../../course/entities/course.entity';
import { CategoryMedia } from '../../media/entities/media.entity';

@Entity({ tableName: 'categories' })
export class Category {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ type: 'varchar' })
    title: string;

    @Property({ type: 'varchar', unique: true })
    slug: string;

    @Property({ type: 'varchar' })
    description: string;

    @OneToMany(() => Course, (course) => course.category)
    courses = new Collection<Course>(this);

    @OneToMany(() => CategoryMedia, (media) => media.category)
    mediaUrl = new Collection<CategoryMedia>(this);

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

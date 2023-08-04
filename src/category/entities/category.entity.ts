import {
    Collection,
    Embeddable,
    Embedded,
    Entity,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Course } from '../../course/entities/course.entity';

@Embeddable()
export class CategoryMedia {
    @Property()
    featuredUri: string;

    @Property()
    coverUri: string;
}

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

    @Embedded(() => CategoryMedia, {
        object: true,
        serializer: (value) =>
            !value
                ? {
                      featured: null,
                      cover: null,
                  }
                : value,
    })
    media: {
        featured: string | null;
        cover: string | null;
    };

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

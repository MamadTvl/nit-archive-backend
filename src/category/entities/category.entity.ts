import {
    Collection,
    Embeddable,
    Embedded,
    Entity,
    ManyToMany,
    ManyToOne,
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

    @ManyToMany(() => Course, (course) => course.subcategories)
    sub_courses = new Collection<Course>(this);

    @ManyToOne(() => Category, {
        fieldName: 'parent_id',
        nullable: true,
        hidden: true,
    })
    parent: Category;

    @OneToMany(() => Category, (cat) => cat.parent)
    children = new Collection<Category>(this);

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

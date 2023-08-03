import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Category } from '../../category/entities/category.entity';
import { Course } from '../../course/entities/course.entity';
import { User } from '../../user/entities/user.entity';

export enum MediaType {
    User = 'User',
    Course = 'Course',
    Category = 'Category',
}

export enum MediaCollection {
    Featured = 'featured',
    Avatar = 'avatar',
    Heading = 'heading',
    Cover = 'cover',
}

@Embeddable({ abstract: true, discriminatorColumn: 'type' })
export abstract class Media {
    @Enum(() => MediaType)
    type: MediaType;

    @Property()
    uri: string;

    @Property()
    width: number;

    @Property()
    height: number;

    @Enum(() => MediaCollection)
    collection: MediaCollection;

    @Property({ fieldName: 'created_at', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
    updatedAt: Date;
}

@Embeddable({ discriminatorValue: MediaType.Course })
export class CourseMedia extends Media {
    constructor() {
        super();
        this.type = MediaType.Course;
    }

    @ManyToOne(() => Course, { fieldName: 'course_id' })
    course: Course;
}

@Embeddable({ discriminatorValue: MediaType.User })
export class UserMedia extends Media {
    constructor() {
        super();
        this.type = MediaType.User;
    }

    @ManyToOne(() => User, { fieldName: 'user_id' })
    user: User;
}

@Embeddable({ discriminatorValue: MediaType.Category })
export class CategoryMedia extends Media {
    constructor() {
        super();
        this.type = MediaType.Category;
    }

    @ManyToOne(() => Category, { fieldName: 'category_id' })
    category: Category;
}

@Entity({ tableName: 'media' })
export class MediaOwner {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Embedded(() => [UserMedia, CourseMedia, CategoryMedia], {
        prefix: false,
    })
    model: UserMedia | CourseMedia | CategoryMedia;
}

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
import { Category } from '../../category/entities/category.entity';
import { Topic } from '../../topic/entities/topic.entity';
import { User } from '../../user/entities/user.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { CourseStatus } from './course-status.entity';

@Embeddable()
export class CourseMedia {
    @Property()
    featuredUri: string;

    @Property()
    coverUri: string;
}

@Entity({ tableName: 'courses' })
export class Course {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ type: 'varchar' })
    title: string;

    @Property({ type: 'varchar', unique: true })
    slug: string;

    @Property({ type: 'varchar' })
    description: string;

    @Property({
        persist: false,
        serializer: (value) => (value ? +value : 0),
        type: 'string',
    })
    averageRating: number;

    @Property({
        persist: false,
        serializer: (value) => (value ? +value : 0),
        type: 'string',
    })
    duration: number;

    @ManyToOne(() => Category, { nullable: true, fieldName: 'category_id' })
    category?: Category;

    @ManyToMany()
    topics = new Collection<Topic>(this);

    @ManyToMany(() => User, (user) => user.courses)
    subscribedUsers = new Collection<User>(this);

    @ManyToMany(() => User, (user) => user.contributedCourses)
    instructors = new Collection<User>(this);

    @Property({ persist: false })
    get instructor() {
        const instructors = this.instructors.toArray();
        if (instructors.length === 1) {
            return instructors[0];
        }
        return undefined;
    }

    @Embedded(() => CourseMedia, {
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

    @ManyToOne(() => CourseStatus, { fieldName: 'status_id', nullable: true })
    status: CourseStatus;

    @OneToMany(() => Rating, (rating) => rating.course)
    ratings = new Collection<Rating>(this);

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

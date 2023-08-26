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

type RatingTable = {
    '1': {
        total: number;
        percentage: number;
    };
    '2': {
        total: number;
        percentage: number;
    };
    '3': {
        total: number;
        percentage: number;
    };
    '4': {
        total: number;
        percentage: number;
    };
    '5': {
        total: number;
        percentage: number;
    };
};

@Embeddable()
export class CourseMedia {
    @Property({ nullable: true })
    featuredUri: string;

    @Property({ nullable: true })
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
        fieldName: 'averageRating',
    })
    averageRating: number;

    @Property({
        persist: false,
        fieldName: 'ratingTable',
    })
    get ratingTable(): RatingTable {
        if (!this.ratings.isInitialized()) {
            return undefined;
        }
        const ratings = this.ratings.toArray();
        const table = {
            '1': {
                total: 0,
                percentage: 0,
            },
            '2': {
                total: 0,
                percentage: 0,
            },
            '3': {
                total: 0,
                percentage: 0,
            },
            '4': {
                total: 0,
                percentage: 0,
            },
            '5': {
                total: 0,
                percentage: 0,
            },
        };
        for (const rate of ratings) {
            const star = rate.rating;
            table[star].total = table[star].total + 1;
        }
        Object.keys(table).forEach((item) => {
            table[item].percentage = (table[item].total / ratings.length) * 100;
        });

        return table;
    }

    @Property({
        persist: false,
        serializer: (value) => (value ? +value : 0),
        type: 'string',
    })
    duration: number;

    @Property({
        persist: false,
        type: 'number',
    })
    videosCount: number;

    @ManyToOne(() => Category, { nullable: true, fieldName: 'category_id' })
    category?: Category;

    @ManyToMany()
    subcategories = new Collection<Category>(this);

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
        nullable: true,
        serializer: (value) =>
            !value
                ? {
                      featuredUri: null,
                      coverUri: null,
                  }
                : value,
    })
    media: CourseMedia;

    @ManyToOne(() => CourseStatus, { fieldName: 'status_id', nullable: true })
    status: CourseStatus;

    @OneToMany(() => Rating, (rating) => rating.course)
    ratings = new Collection<Rating>(this);

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

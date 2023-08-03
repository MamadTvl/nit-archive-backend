import {
    Collection,
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
import { CourseRating } from '../../rating/entities/rating.entity';
import { CourseMedia } from '../../media/entities/media.entity';

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

    @ManyToOne(() => Category, { nullable: true, fieldName: 'category_id' })
    category?: Category;

    @ManyToMany()
    topics = new Collection<Topic>(this);

    @ManyToMany(() => User, (user) => user.courses)
    subscribedUsers = new Collection<User>(this);

    @ManyToMany(() => User, (user) => user.contributedCourses)
    instructors = new Collection<User>(this);

    @OneToMany(() => CourseMedia, (media) => media.course)
    mediaUrl = new Collection<CourseMedia>(this);

    @OneToMany(() => CourseRating, (rating) => rating.course)
    ratings = new Collection<CourseRating>(this);

    @Property({ type: 'timestamp', onCreate: () => new Date() })
    createdAt: Date;

    @Property({ type: 'timestamp', onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

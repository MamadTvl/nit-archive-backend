import {
    Collection,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { AccessToken } from './access-token.entity';
import { Course } from '../../course/entities/course.entity';
import { CourseRating, VideoRating } from '../../rating/entities/rating.entity';
import { UserMedia } from '../../media/entities/media.entity';
import { Role } from '../../role/entities/role.entity';

@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ nullable: true, hidden: true })
    phone: string;

    @Property({ nullable: true, hidden: true })
    email: string;

    @Property({ hidden: true, unique: true })
    username: string;

    @Property({ hidden: true })
    password: string;

    @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
    accessTokens = new Collection<AccessToken>(this);

    @OneToMany(() => CourseRating, (rating) => rating.user)
    courseRatings = new Collection<CourseRating>(this);

    @OneToMany(() => VideoRating, (rating) => rating.user)
    videoRatings = new Collection<VideoRating>(this);

    @ManyToMany()
    courses = new Collection<Course>(this);

    @ManyToMany()
    roles = new Collection<Role>(this);

    @ManyToMany()
    contributedCourses = new Collection<Course>(this);

    @OneToMany(() => UserMedia, (media) => media.user)
    mediaUrls = new Collection<UserMedia>(this);

    @Property({ nullable: true })
    firstName: string;

    @Property({ nullable: true })
    lastName: string;

    @Property({ type: 'tinyint' })
    isVerified: boolean;

    @Property({ onCreate: () => new Date() })
    createdAt: Date;

    @Property({ onUpdate: () => new Date(), nullable: true })
    updatedAt: Date;
}

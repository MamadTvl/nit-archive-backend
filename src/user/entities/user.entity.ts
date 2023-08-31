import {
    Collection,
    Embeddable,
    Embedded,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { AccessToken } from './access-token.entity';
import { Course } from '../../course/entities/course.entity';
import { Role } from '../../role/entities/role.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { LoginDto } from '../../user/dto/login.dto';

@Embeddable()
export class UserMedia {
    @Property()
    avatarUri: string;
}

@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property({ nullable: true, hidden: true })
    phone: string;

    @Property({ nullable: true, hidden: true })
    email: string;

    @Property({ unique: true })
    username: string;

    @Property({ hidden: true })
    password: string;

    @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
    accessTokens = new Collection<AccessToken>(this);

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings = new Collection<Rating>(this);

    @ManyToMany()
    courses = new Collection<Course>(this);

    @ManyToMany()
    roles = new Collection<Role>(this);

    @ManyToMany()
    contributedCourses = new Collection<Course>(this);

    @Property({ nullable: true })
    firstName: string;

    @Property({ nullable: true })
    lastName: string;

    @Embedded(() => UserMedia, {
        object: true,
        nullable: true,
        serializer: (value) =>
            !value
                ? {
                      avatarUri: null,
                  }
                : value,
    })
    media: UserMedia;

    @Property({ type: 'tinyint' })
    isVerified = false;

    @Property({ onCreate: () => new Date() })
    createdAt: Date;

    @Property({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        nullable: true,
    })
    updatedAt: Date;

    constructor(data: LoginDto) {
        this.username = data.username;
        this.password = data.password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isVerified = false;
    }
}

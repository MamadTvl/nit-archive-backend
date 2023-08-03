import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Course } from '../../course/entities/course.entity';
import { Video } from '../../video/entities/video.entity';
import { User } from '../../user/entities/user.entity';

export enum RatingType {
    Course = 'Course',
    Video = 'Video',
}

@Embeddable({ abstract: true, discriminatorColumn: 'type' })
export abstract class Rating {
    @Enum(() => RatingType)
    type!: RatingType;

    @Property({ unsigned: true })
    rating: number;

    @Property({ nullable: true })
    description: string;

    @ManyToOne(() => User, { fieldName: 'user_id' })
    user: User;

    @Property({ fieldName: 'created_at', onCreate: () => new Date() })
    createdAt: Date;

    @Property({
        fieldName: 'updated_at',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt: Date;
}

@Embeddable({ discriminatorValue: RatingType.Course })
export class VideoRating extends Rating {
    constructor() {
        super();
        this.type = RatingType.Video;
    }

    @ManyToOne(() => Video, { fieldName: 'video_id' })
    video: Video;
}

@Embeddable({ discriminatorValue: RatingType.Course })
export class CourseRating extends Rating {
    constructor() {
        super();
        this.type = RatingType.Course;
    }

    @ManyToOne(() => Course, { fieldName: 'course_id' })
    course: Course;
}

@Entity({ tableName: 'ratings' })
export class RatingOwner {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Embedded(() => [CourseRating, VideoRating])
    model: CourseRating | VideoRating;
}

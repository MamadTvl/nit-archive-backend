import {
    Entity,
    ManyToOne,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { Course } from '../../course/entities/course.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'ratings' })
@Unique({ properties: ['user', 'course'] })
export class Rating {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @ManyToOne(() => Course, { fieldName: 'course_id' })
    course: Course;

    @Property({ unsigned: true })
    rating: number;

    @Property({ nullable: true })
    description: string;

    @ManyToOne(() => User, { fieldName: 'user_id' })
    user: User;

    @Property({
        fieldName: 'created_at',
        onCreate: () => new Date(),
        defaultRaw: 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Property({
        fieldName: 'updated_at',
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
        defaultRaw: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
}

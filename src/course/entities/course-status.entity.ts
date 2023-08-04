import {
    Collection,
    Entity,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Course } from './course.entity';

@Entity({ tableName: 'course_statuses' })
export class CourseStatus {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @Property()
    title: string;

    @Property()
    typographyColor: string;

    @Property()
    bgColor: string;

    @Property()
    iconSrc: string;

    @OneToMany(() => Course, (course) => course.status)
    courses = new Collection<Course>(this);
}

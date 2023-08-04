import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: EntityRepository<Course>,
    ) {}

    create(createCourseDto: CreateCourseDto) {
        return 'This action adds a new course';
    }

    findAll() {
        const qb = this.courseRepository.createQueryBuilder('course');
        qb.leftJoin('course.ratings', 'rating');
        qb.leftJoinAndSelect('course.category', 'category');
        qb.leftJoinAndSelect('course.status', 'status');
        qb.leftJoinAndSelect('course.instructors', 'instructors');
        qb.addSelect('avg(rating.rating) as averageRating');
        qb.groupBy('course.id');
        return qb.getResultList();
    }

    findOne(slug: string) {
        const qb = this.courseRepository.createQueryBuilder('course');
        qb.leftJoinAndSelect('course.ratings', 'rating');
        qb.leftJoinAndSelect('rating.user', 'user');
        qb.leftJoinAndSelect('course.category', 'category');
        qb.leftJoinAndSelect('course.status', 'status');
        qb.leftJoinAndSelect('course.instructors', 'instructors');
        qb.leftJoinAndSelect('course.topics', 'topic');
        qb.leftJoinAndSelect('topic.videos', 'video');
        qb.leftJoinAndSelect('topic.downloadItems', 'downloadItem');
        qb.addSelect('avg(rating.rating) as averageRating');
        qb.addSelect('sum(video.length) as duration');
        qb.where('course.slug = ?', [slug]);
        return qb.getSingleResult();
    }

    update(id: number, updateCourseDto: UpdateCourseDto) {
        return `This action updates a #${id} course`;
    }

    remove(id: number) {
        return `This action removes a #${id} course`;
    }
}

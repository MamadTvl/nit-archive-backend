import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Course } from './entities/course.entity';
import { FindAllQuery } from './course.controller';
import { getPaginateData } from 'utils/pagination';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: EntityRepository<Course>,
    ) {}

    create(createCourseDto: CreateCourseDto) {
        return 'This action adds a new course';
    }

    async findAll(query: FindAllQuery) {
        const qb = this.courseRepository.createQueryBuilder('course');
        qb.leftJoin('course.ratings', 'rating');
        qb.leftJoinAndSelect('course.category', 'category');
        qb.leftJoinAndSelect('course.status', 'status');
        qb.leftJoinAndSelect('course.instructors', 'instructors');
        if (query.title) {
            qb.where({ title: { $like: `%${query.title}%` } });
        }
        if (query.categoryId) {
            qb.andWhere({ category: { id: query.categoryId } });
        }
        const paginationQb = qb.clone();
        if (query.sort === 'newest') {
            qb.orderBy({ createdAt: 'DESC' });
        }
        if (query.sort === 'most-wanted') {
            qb.orderBy({ averageRating: 'DESC' });
        }
        qb.addSelect('avg(rating.rating) as averageRating');
        qb.groupBy('course.id');
        if (query.type === 'list') {
            const total = await paginationQb.getCount();
            const pagination = getPaginateData<Course>(qb, total);
            return pagination(+query.pageSize, query.page);
        }
        qb.limit(8);
        return qb.getResultList();
    }

    // findSliderCourses() {
    // }

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

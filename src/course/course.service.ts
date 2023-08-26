import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Course } from './entities/course.entity';
import { FindAllQuery } from './dto/find-course.dto';
import { getPaginateData } from 'utils/pagination';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: EntityRepository<Course>,
    ) {}

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
        if (query.subcategoryId) {
            qb.leftJoin('course.subcategories', 'subcategory');
            qb.andWhere({ subcategories: { id: query.subcategoryId } });
        }
        const paginationQb = qb.clone();
        if (query.sort === 'newest') {
            qb.orderBy({ createdAt: 'DESC' });
        }
        if (query.sort === 'most-wanted') {
            qb.orderBy({ averageRating: 'DESC' });
        }
        qb.addSelect('avg(rating.rating) as averageRating');
        qb.leftJoin('course.topics', 'topic');
        qb.leftJoin('topic.videos', 'video');
        qb.addSelect('sum(video.length) as duration');
        qb.addSelect('count(video.id) as videosCount');
        qb.groupBy('course.id');
        if (query.type === 'list') {
            const total = await paginationQb.getCount();
            const pagination = getPaginateData<Course>(qb, total);
            return pagination(+query.pageSize, query.page);
        }
        qb.limit(8);
        return qb.getResultList();
    }

    async getCourseStats(slug: string) {
        const qb = this.courseRepository.createQueryBuilder('course');
        qb.leftJoinAndSelect('course.ratings', 'rating');
        qb.leftJoinAndSelect('course.topics', 'topic');
        qb.leftJoinAndSelect('topic.videos', 'video');
        qb.addSelect('avg(rating.rating) as averageRating');
        qb.addSelect('sum(video.length) as duration');
        qb.addSelect('count(video.id) as videosCount');
        qb.where('course.slug = ?', [slug]);
        const { averageRating, duration, videosCount } =
            await qb.getSingleResult();
        return { averageRating, duration, videosCount };
    }

    async findOne(slug: string) {
        const qb = this.courseRepository.createQueryBuilder('course');
        qb.leftJoinAndSelect('course.ratings', 'rating');
        qb.leftJoinAndSelect('rating.user', 'user');
        qb.leftJoinAndSelect('course.category', 'category');
        qb.leftJoinAndSelect('course.status', 'status');
        qb.leftJoinAndSelect('course.instructors', 'instructors');
        qb.leftJoinAndSelect('course.topics', 'topic');
        qb.leftJoinAndSelect('topic.videos', 'video');
        qb.leftJoinAndSelect('topic.downloadItems', 'downloadItem');
        qb.where('course.slug = ?', [slug]);
        try {
            const { averageRating, duration, videosCount } =
                await this.getCourseStats(slug);
            const course = await qb.getSingleResult();
            course.averageRating = averageRating;
            course.duration = duration;
            course.videosCount = videosCount;
            return course;
        } catch (err) {
            console.log(err);
            throw new NotFoundException();
        }
    }
}

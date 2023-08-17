import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './entities/rating.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { UserService } from 'user/user.service';

@Injectable()
export class RatingService {
    constructor(
        private readonly userService: UserService,
        private em: EntityManager,
    ) {
        this.em = em.fork();
    }

    async upsert(userId: number, createRatingDto: CreateRatingDto) {
        const userOwns = await this.userService.userOwns(
            createRatingDto.courseId,
            userId,
        );
        if (!userOwns) {
            throw new HttpException(
                'Subscription Required',
                HttpStatus.PAYMENT_REQUIRED,
            );
        }
        const rating = await this.em.upsert(Rating, {
            course: createRatingDto.courseId,
            description: createRatingDto.comment,
            rating: createRatingDto.rating,
            user: userId,
        });
        return rating.id;
    }

    async find(userId: number, courseId: number) {
        try {
            const rating = await this.em.findOneOrFail(Rating, {
                course: courseId,
                user: userId,
            });
            return rating;
        } catch {
            throw new NotFoundException();
        }
    }
}

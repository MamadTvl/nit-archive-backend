import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository, EntityManager } from '@mikro-orm/mysql';
import { AccessToken } from './entities/access-token.entity';
import { createHash, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Course } from 'course/entities/course.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Video } from 'video/entities/video.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        @InjectRepository(AccessToken)
        private readonly tokenRepository: EntityRepository<AccessToken>,
        private readonly em: EntityManager,
    ) {}

    private async createToken(userId: number) {
        const token = randomUUID();
        const accessToken = this.tokenRepository.create({
            user: { id: userId },
            token: createHash('sha256').update(token).digest('hex'),
        });
        const tokenId: number = await this.em.insert(AccessToken, accessToken);
        return `${tokenId}|${token}`;
    }

    async singUp(data: LoginDto) {
        const hashedPassword = await bcrypt.hash(
            data.password,
            bcrypt.genSaltSync(8),
        );
        const user = this.userRepository.create({
            username: data.username,
            password: hashedPassword,
        });
        const userId: number = await this.em.insert(User, user);
        return this.createToken(userId);
    }

    async login({ username, password }: LoginDto) {
        const error = 'given data is invalid';
        const user = await this.userRepository.findOne({ username });
        if (!user) {
            throw new BadRequestException(error);
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            throw new BadRequestException(error);
        }
        return this.createToken(user.id);
    }

    async logout(userId: number) {
        await this.tokenRepository.nativeUpdate(
            { user: { id: userId } },
            { deletedAt: new Date() },
        );
    }

    async update(userId: number, data: UpdateUserDto) {
        const user = this.em.getReference(User, userId);
        user.username = data.username;
        if (data.password) {
            const hashedPassword = await bcrypt.hash(
                data.password,
                bcrypt.genSaltSync(8),
            );
            user.password = hashedPassword;
        }
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.phone = data.phone;
        user.email = data.email;
        try {
            await this.em.flush();
        } catch (err) {
            if (err instanceof UniqueConstraintViolationException) {
                throw new BadRequestException(
                    'username or phone or email already taken',
                );
            }
            throw new BadRequestException();
        }
    }

    async getUserCourses(userId: number) {
        const qb = this.em.createQueryBuilder(Course, 'course');
        qb.innerJoinAndSelect('course.subscribedUsers', 'user');
        qb.leftJoin('course.ratings', 'rating');
        qb.leftJoin('course.topics', 'topic');
        qb.leftJoin('topic.videos', 'video');
        qb.addSelect('sum(video.length) as duration');
        qb.addSelect('count(video.id) as videosCount');
        qb.where('user.id = ?', [userId]);
        qb.groupBy('course.id');
        const courses = await qb.getResultList();
        return courses;
    }

    async subscribeToCourse(userId: number, courseId: number) {
        try {
            const course = await this.em.findOneOrFail(Course, {
                id: courseId,
            });
            const userRef = this.em.getReference(User, userId);
            course.subscribedUsers.add(userRef);
            await this.em.flush();
        } catch {
            throw new NotFoundException();
        }
    }

    async userOwns(courseId: number, userId: number) {
        try {
            await this.em.findOneOrFail(
                Course,
                { id: courseId, subscribedUsers: { id: userId } },
                { populate: ['subscribedUsers'] },
            );
        } catch {
            return false;
        }
        return true;
    }

    async userOwnsVideo(videoId: number, userId: number) {
        const qb = this.em.createQueryBuilder(Video, 'video');
        qb.innerJoinAndSelect('video.topic', 'topic');
        qb.innerJoinAndSelect('topic.courses', 'course');
        qb.innerJoinAndSelect('course.subscribedUsers', 'user');
        qb.where('user.id = ?', [userId]);
        qb.andWhere('video.id = ?', [videoId]);
        const video = await qb.getSingleResult();
        if (!video) {
            return false;
        }
        return true;
    }
}

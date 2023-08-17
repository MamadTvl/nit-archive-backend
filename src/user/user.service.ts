import { BadRequestException, Injectable } from '@nestjs/common';
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
}

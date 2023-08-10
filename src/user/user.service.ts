import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository, EntityManager } from '@mikro-orm/mysql';
import { AccessToken } from './entities/access-token.entity';
import { createHash, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

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
}

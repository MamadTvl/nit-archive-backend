import { createHash } from 'crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from 'user/entities/user.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { AccessToken } from 'user/entities/access-token.entity';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(User) private userRepository: EntityRepository<User>,
        @InjectRepository(AccessToken)
        private tokenRepository: EntityRepository<AccessToken>,
    ) {}

    findUser(tokenId: number, token: string) {
        return this.userRepository.findOne(
            {
                accessTokens: {
                    id: tokenId,
                    token: createHash('sha256').update(token).digest('hex'),
                    deletedAt: null,
                },
            },
            {
                populate: ['roles', 'accessTokens'],
            },
        );
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const bearerToken = req.headers.authorization || '';
        const [id, token] = bearerToken.replace('Bearer ', '').split('|');
        if (id && token) {
            const user = await this.findUser(+id, token);
            if (user) {
                this.tokenRepository.nativeUpdate(
                    { id: +id },
                    { lastUsedAt: new Date() },
                );
            }
            req.user = user;
        }
        next();
    }
}

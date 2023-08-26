import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';
import { createHash } from 'crypto';

@Entity({ tableName: 'access_tokens' })
export class AccessToken {
    @PrimaryKey({ autoincrement: true })
    id: number;

    @ManyToOne(() => User, { fieldName: 'user_id' })
    user: User;

    @Property({ hidden: true })
    token: string;

    @Property({ onCreate: () => new Date() })
    createdAt: Date;

    @Property({ onCreate: () => new Date() })
    lastUsedAt: Date;

    @Property({ nullable: true })
    deletedAt: Date | null;

    constructor(token: string) {
        this.createdAt = new Date();
        this.lastUsedAt = new Date();
    }
}

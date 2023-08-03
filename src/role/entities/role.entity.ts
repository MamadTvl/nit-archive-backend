import {
    Collection,
    Entity,
    ManyToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';

@Entity({ tableName: 'roles' })
export class Role {
    @PrimaryKey()
    id: number;

    @Property({ unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles)
    users = new Collection<User>(this);
}

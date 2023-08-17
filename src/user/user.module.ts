import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { AccessToken } from './entities/access-token.entity';

@Module({
    imports: [MikroOrmModule.forFeature([User, AccessToken])],
    controllers: [UserController],
    providers: [UserService],
    exports: [MikroOrmModule.forFeature([User, AccessToken]), UserService],
})
export class UserModule {}

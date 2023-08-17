import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Rating } from './entities/rating.entity';
import { UserService } from 'user/user.service';
import { UserModule } from 'user/user.module';

@Module({
    imports: [MikroOrmModule.forFeature([Rating]), UserModule],
    controllers: [RatingController],
    providers: [RatingService],
})
export class RatingModule {}

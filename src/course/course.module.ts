import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Course } from './entities/course.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Course])],
    controllers: [CourseController],
    providers: [CourseService],
})
export class CourseModule {}

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllQuery } from './dto/find-course.dto';

@ApiTags('course')
@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    async findAll(@Query() query: FindAllQuery) {
        const courses = await this.courseService.findAll(query);
        return {
            message: 'courses found',
            courses,
            query,
        };
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.courseService.findOne(slug);
    }
}

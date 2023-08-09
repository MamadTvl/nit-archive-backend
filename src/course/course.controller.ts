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
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllQuery {
    @IsIn(['list', 'slider'])
    type: 'list' | 'slider' = 'list';

    @IsIn(['newest', 'most-wanted'])
    sort: 'newest' | 'most-wanted' = 'newest';

    @IsOptional()
    @IsNumberString()
    page?: number;

    @IsOptional()
    @IsNumberString()
    pageSize = '12';

    @IsOptional()
    @IsNumberString()
    categoryId?: string;

    @IsOptional()
    title?: string;
}

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.courseService.create(createCourseDto);
    }

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

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
        return this.courseService.update(id, updateCourseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.courseService.remove(+id);
    }
}

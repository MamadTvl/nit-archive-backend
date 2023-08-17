import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Param,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthGuard } from 'common/guard/auth.guard';
import { Request } from 'express';

@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createRatingDto: CreateRatingDto,
        @Req() req: Request,
    ) {
        const userId = req.user.id;
        const id = await this.ratingService.upsert(userId, createRatingDto);
        return {
            message: 'successfully added',
            id,
        };
    }

    @Get('/course/:course_id')
    @UseGuards(AuthGuard)
    async find(@Param('course_id') courseId: number, @Req() req: Request) {
        const userId = req.user.id;
        const rating = await this.ratingService.find(userId, courseId);
        return {
            rating,
        };
    }
}

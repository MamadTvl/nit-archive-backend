import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
    @IsNumber()
    rating: number;

    @IsOptional()
    @IsString()
    comment: string;

    @IsNumber()
    courseId: number;
}

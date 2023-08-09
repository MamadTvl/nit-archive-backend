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
    @IsNumberString()
    subcategoryId?: string;

    @IsOptional()
    title?: string;
}

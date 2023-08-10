import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    async findAll() {
        const categories = await this.categoryService.findAll();
        return {
            message: 'categories found',
            categories,
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const category = await this.categoryService.findOne(+id);
        return {
            message: 'category found',
            category,
        };
    }
}

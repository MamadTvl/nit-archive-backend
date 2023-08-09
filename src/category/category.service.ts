import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { EntityRepository } from '@mikro-orm/mysql';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: EntityRepository<Category>,
    ) {}

    create(createCategoryDto: CreateCategoryDto) {
        return 'This action adds a new category';
    }

    findAll() {
        return this.categoryRepository.find({}, { populate: ['children'] });
    }

    async findOne(id: number) {
        try {
            const category = await this.categoryRepository.findOneOrFail(
                { id },
                { populate: ['children'] },
            );
            return category;
        } catch {
            throw new NotFoundException();
        }
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}

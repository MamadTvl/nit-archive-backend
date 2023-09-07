import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: EntityRepository<Category>,
    ) {}

    findAll() {
        return this.categoryRepository.find(
            { parent: null },
            { populate: ['children'] },
        );
    }

    async findOne(id: number) {
        try {
            const category = await this.categoryRepository.findOneOrFail(
                { id, parent: null },
                { populate: ['children'] },
            );
            return category;
        } catch {
            throw new NotFoundException();
        }
    }
}

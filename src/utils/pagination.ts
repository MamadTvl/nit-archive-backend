import { QueryBuilder } from '@mikro-orm/mysql';

export interface PaginationResult<Model> {
    data: Model[];
    pageSize: number;
    page: number;
    pagesCount: number;
    total: number;
}

export const getPaginateData =
    <Model extends object>(qb: QueryBuilder<Model>, total: number) =>
    async (pageSize: number, page = 1): Promise<PaginationResult<Model>> => {
        const pagesCount =
            Math.floor(total / pageSize) + (total % pageSize !== 0 ? 1 : 0);
        const offset = (page - 1) * pageSize;
        qb.limit(pageSize, offset);
        const data = await qb.getResultList();
        return {
            data,
            pageSize,
            page: +page,
            pagesCount,
            total,
        };
    };

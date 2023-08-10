import { Migration } from '@mikro-orm/migrations';

export class Migration20230809153442 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `categories` drop foreign key `categories_parent_id_foreign`;',
        );

        this.addSql(
            'alter table `categories` modify `parent_id` int unsigned null;',
        );
        this.addSql(
            'alter table `categories` add constraint `categories_parent_id_foreign` foreign key (`parent_id`) references `categories` (`id`) on update cascade on delete set null;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `categories` drop foreign key `categories_parent_id_foreign`;',
        );

        this.addSql(
            'alter table `categories` modify `parent_id` int unsigned not null;',
        );
        this.addSql(
            'alter table `categories` add constraint `categories_parent_id_foreign` foreign key (`parent_id`) references `categories` (`id`) on update cascade;',
        );
    }
}

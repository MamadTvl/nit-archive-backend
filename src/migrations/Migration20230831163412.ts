import { Migration } from '@mikro-orm/migrations';

export class Migration20230831163412 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `courses` add `is_active` tinyint not null default true;',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table `courses` drop `is_active`;');
    }
}

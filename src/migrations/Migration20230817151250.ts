import { Migration } from '@mikro-orm/migrations';

export class Migration20230817151250 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `ratings` modify `created_at` datetime not null default CURRENT_TIMESTAMP, modify `updated_at` datetime not null default CURRENT_TIMESTAMP;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `ratings` modify `created_at` datetime not null, modify `updated_at` datetime not null;',
        );
    }
}

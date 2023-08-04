import { Migration } from '@mikro-orm/migrations';

export class Migration20230803202001 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table `videos` add `length` int not null default 0;',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table `videos` drop `length`;');
    }
}

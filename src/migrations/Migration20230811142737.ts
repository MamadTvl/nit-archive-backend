import { Migration } from '@mikro-orm/migrations';

export class Migration20230811142737 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table `users` add `media` json not null;');
    }

    async down(): Promise<void> {
        this.addSql('alter table `users` drop `media`;');
    }
}

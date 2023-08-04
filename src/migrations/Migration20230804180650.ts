import { Migration } from '@mikro-orm/migrations';

export class Migration20230804180650 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table `categories` add `media` json not null;');

        this.addSql(
            'alter table `courses` change `media_url` `media` json not null;',
        );
    }

    async down(): Promise<void> {
        this.addSql('alter table `categories` drop `media`;');

        this.addSql(
            'alter table `courses` change `media` `media_url` json not null;',
        );
    }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230803170953 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table `courses` add `media_url` json not null;');
        this.addSql('alter table `courses` drop `media_url_featured_uri`;');
        this.addSql('alter table `courses` drop `media_url_featured_cover`;');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `courses` add `media_url_featured_uri` varchar(255) not null, add `media_url_featured_cover` varchar(255) not null;',
        );
        this.addSql('alter table `courses` drop `media_url`;');
    }
}

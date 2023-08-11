import { Migration } from '@mikro-orm/migrations';

export class Migration20230811142845 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table `categories` modify `media` json null;');

        this.addSql('alter table `courses` modify `media` json null;');

        this.addSql('alter table `users` modify `media` json null;');
    }

    async down(): Promise<void> {
        this.addSql('alter table `categories` modify `media` json not null;');

        this.addSql('alter table `courses` modify `media` json not null;');

        this.addSql('alter table `users` modify `media` json not null;');
    }
}

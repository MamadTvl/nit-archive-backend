import { Migration } from '@mikro-orm/migrations';

export class Migration20230810143030 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `videos` drop index `videos_slug_unique`;');
    this.addSql('alter table `videos` drop `slug`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `videos` add `slug` varchar(255) null;');
    this.addSql('alter table `videos` add unique `videos_slug_unique`(`slug`);');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230825101651 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `videos` change `description` `title` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `videos` change `title` `description` varchar(255) null;');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230809153426 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `categories` add `parent_id` int unsigned not null;');
    this.addSql('alter table `categories` add constraint `categories_parent_id_foreign` foreign key (`parent_id`) references `categories` (`id`) on update cascade;');
    this.addSql('alter table `categories` add index `categories_parent_id_index`(`parent_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `categories` drop foreign key `categories_parent_id_foreign`;');

    this.addSql('alter table `categories` drop index `categories_parent_id_index`;');
    this.addSql('alter table `categories` drop `parent_id`;');
  }

}

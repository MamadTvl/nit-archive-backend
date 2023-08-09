import { Migration } from '@mikro-orm/migrations';

export class Migration20230809154458 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `courses_subcategories` (`course_id` int unsigned not null, `category_id` int unsigned not null, primary key (`course_id`, `category_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `courses_subcategories` add index `courses_subcategories_course_id_index`(`course_id`);');
    this.addSql('alter table `courses_subcategories` add index `courses_subcategories_category_id_index`(`category_id`);');

    this.addSql('alter table `courses_subcategories` add constraint `courses_subcategories_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `courses_subcategories` add constraint `courses_subcategories_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `courses_subcategories`;');
  }

}

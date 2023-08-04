import { Migration } from '@mikro-orm/migrations';

export class Migration20230804175736 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `course_statuses` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `typography_color` varchar(255) not null, `bg_color` varchar(255) not null, `icon_src` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
        );

        this.addSql(
            'alter table `courses` add `status_id` int unsigned not null;',
        );
        this.addSql(
            'alter table `courses` add constraint `courses_status_id_foreign` foreign key (`status_id`) references `course_statuses` (`id`) on update cascade;',
        );
        this.addSql(
            'alter table `courses` add index `courses_status_id_index`(`status_id`);',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `courses` drop foreign key `courses_status_id_foreign`;',
        );

        this.addSql('drop table if exists `course_statuses`;');

        this.addSql(
            'alter table `courses` drop index `courses_status_id_index`;',
        );
        this.addSql('alter table `courses` drop `status_id`;');
    }
}

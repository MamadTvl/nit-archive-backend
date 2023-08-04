import { Migration } from '@mikro-orm/migrations';

export class Migration20230804172655 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `download_items` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `url` varchar(255) not null, `topic_id` int unsigned not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `download_items` add index `download_items_topic_id_index`(`topic_id`);',
        );

        this.addSql(
            'alter table `download_items` add constraint `download_items_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists `download_items`;');
    }
}

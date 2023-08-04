import { Migration } from '@mikro-orm/migrations';

export class Migration20230803170904 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop table if exists `media`;');

        this.addSql(
            'alter table `courses` add `media_url_featured_uri` varchar(255) not null, add `media_url_featured_cover` varchar(255) not null;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            "create table `media` (`id` int unsigned not null auto_increment primary key, `course_id` int unsigned null, `type` enum('User', 'Course', 'Category') not null, `uri` varchar(255) not null, `width` int not null, `height` int not null, `collection` enum('featured', 'avatar', 'heading', 'cover') not null, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int unsigned null, `category_id` int unsigned null) default character set utf8mb4 engine = InnoDB;",
        );
        this.addSql(
            'alter table `media` add index `media_course_id_index`(`course_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_type_index`(`type`);',
        );
        this.addSql(
            'alter table `media` add index `media_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `media` add index `media_category_id_index`(`category_id`);',
        );

        this.addSql(
            'alter table `media` add constraint `media_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `media` add constraint `media_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `media` add constraint `media_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete set null;',
        );

        this.addSql('alter table `courses` drop `media_url_featured_uri`;');
        this.addSql('alter table `courses` drop `media_url_featured_cover`;');
    }
}

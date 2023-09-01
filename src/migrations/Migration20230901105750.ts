import { Migration } from '@mikro-orm/migrations';

export class Migration20230901105750 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `categories` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `slug` varchar(255) not null, `description` varchar(255) not null, `parent_id` int unsigned null, `media` json null, `created_at` datetime not null, `updated_at` datetime null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `categories` add unique `categories_slug_unique`(`slug`);',
        );
        this.addSql(
            'alter table `categories` add index `categories_parent_id_index`(`parent_id`);',
        );

        this.addSql(
            'create table `course_statuses` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `typography_color` varchar(255) not null, `bg_color` varchar(255) not null, `icon_src` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
        );

        this.addSql(
            'create table `courses` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `slug` varchar(255) not null, `description` varchar(255) not null, `category_id` int unsigned null, `media` json null, `status_id` int unsigned null, `is_active` tinyint not null default true, `created_at` datetime not null, `updated_at` datetime null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `courses` add unique `courses_slug_unique`(`slug`);',
        );
        this.addSql(
            'alter table `courses` add index `courses_category_id_index`(`category_id`);',
        );
        this.addSql(
            'alter table `courses` add index `courses_status_id_index`(`status_id`);',
        );

        this.addSql(
            'create table `courses_subcategories` (`course_id` int unsigned not null, `category_id` int unsigned not null, primary key (`course_id`, `category_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `courses_subcategories` add index `courses_subcategories_course_id_index`(`course_id`);',
        );
        this.addSql(
            'alter table `courses_subcategories` add index `courses_subcategories_category_id_index`(`category_id`);',
        );

        this.addSql(
            'create table `roles` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `roles` add unique `roles_name_unique`(`name`);',
        );

        this.addSql(
            'create table `topics` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;',
        );

        this.addSql(
            'create table `download_items` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) not null, `url` varchar(255) not null, `topic_id` int unsigned not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `download_items` add index `download_items_topic_id_index`(`topic_id`);',
        );

        this.addSql(
            'create table `courses_topics` (`course_id` int unsigned not null, `topic_id` int unsigned not null, primary key (`course_id`, `topic_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `courses_topics` add index `courses_topics_course_id_index`(`course_id`);',
        );
        this.addSql(
            'alter table `courses_topics` add index `courses_topics_topic_id_index`(`topic_id`);',
        );

        this.addSql(
            'create table `users` (`id` int unsigned not null auto_increment primary key, `phone` varchar(255) null, `email` varchar(255) null, `username` varchar(255) not null, `password` varchar(255) not null, `first_name` varchar(255) null, `last_name` varchar(255) null, `media` json null, `is_verified` tinyint not null, `created_at` datetime not null, `updated_at` datetime null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `users` add unique `users_username_unique`(`username`);',
        );

        this.addSql(
            'create table `ratings` (`id` int unsigned not null auto_increment primary key, `course_id` int unsigned not null, `rating` int unsigned not null, `description` varchar(255) null, `user_id` int unsigned not null, `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_course_id_index`(`course_id`);',
        );
        this.addSql(
            'alter table `ratings` add index `ratings_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `ratings` add unique `ratings_user_id_course_id_unique`(`user_id`, `course_id`);',
        );

        this.addSql(
            'create table `access_tokens` (`id` int unsigned not null auto_increment primary key, `user_id` int unsigned not null, `token` varchar(255) not null, `created_at` datetime not null, `last_used_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `access_tokens` add index `access_tokens_user_id_index`(`user_id`);',
        );

        this.addSql(
            'create table `users_contributed_courses` (`user_id` int unsigned not null, `course_id` int unsigned not null, primary key (`user_id`, `course_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `users_contributed_courses` add index `users_contributed_courses_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `users_contributed_courses` add index `users_contributed_courses_course_id_index`(`course_id`);',
        );

        this.addSql(
            'create table `users_courses` (`user_id` int unsigned not null, `course_id` int unsigned not null, primary key (`user_id`, `course_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `users_courses` add index `users_courses_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `users_courses` add index `users_courses_course_id_index`(`course_id`);',
        );

        this.addSql(
            'create table `users_roles` (`user_id` int unsigned not null, `role_id` int unsigned not null, primary key (`user_id`, `role_id`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `users_roles` add index `users_roles_user_id_index`(`user_id`);',
        );
        this.addSql(
            'alter table `users_roles` add index `users_roles_role_id_index`(`role_id`);',
        );

        this.addSql(
            'create table `videos` (`id` int unsigned not null auto_increment primary key, `title` varchar(255) null, `video_file` varchar(255) null, `aparat_iframe` varchar(255) null, `length` int not null default 0, `topic_id` int unsigned not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `videos` add index `videos_topic_id_index`(`topic_id`);',
        );

        this.addSql(
            'alter table `categories` add constraint `categories_parent_id_foreign` foreign key (`parent_id`) references `categories` (`id`) on update cascade on delete set null;',
        );

        this.addSql(
            'alter table `courses` add constraint `courses_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete set null;',
        );
        this.addSql(
            'alter table `courses` add constraint `courses_status_id_foreign` foreign key (`status_id`) references `course_statuses` (`id`) on update cascade on delete set null;',
        );

        this.addSql(
            'alter table `courses_subcategories` add constraint `courses_subcategories_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `courses_subcategories` add constraint `courses_subcategories_category_id_foreign` foreign key (`category_id`) references `categories` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `download_items` add constraint `download_items_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade;',
        );

        this.addSql(
            'alter table `courses_topics` add constraint `courses_topics_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `courses_topics` add constraint `courses_topics_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `ratings` add constraint `ratings_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade;',
        );
        this.addSql(
            'alter table `ratings` add constraint `ratings_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
        );

        this.addSql(
            'alter table `access_tokens` add constraint `access_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
        );

        this.addSql(
            'alter table `users_contributed_courses` add constraint `users_contributed_courses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_contributed_courses` add constraint `users_contributed_courses_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `users_courses` add constraint `users_courses_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_courses` add constraint `users_courses_course_id_foreign` foreign key (`course_id`) references `courses` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `users_roles` add constraint `users_roles_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete cascade;',
        );
        this.addSql(
            'alter table `users_roles` add constraint `users_roles_role_id_foreign` foreign key (`role_id`) references `roles` (`id`) on update cascade on delete cascade;',
        );

        this.addSql(
            'alter table `videos` add constraint `videos_topic_id_foreign` foreign key (`topic_id`) references `topics` (`id`) on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table `categories` drop foreign key `categories_parent_id_foreign`;',
        );

        this.addSql(
            'alter table `courses` drop foreign key `courses_category_id_foreign`;',
        );

        this.addSql(
            'alter table `courses_subcategories` drop foreign key `courses_subcategories_category_id_foreign`;',
        );

        this.addSql(
            'alter table `courses` drop foreign key `courses_status_id_foreign`;',
        );

        this.addSql(
            'alter table `courses_subcategories` drop foreign key `courses_subcategories_course_id_foreign`;',
        );

        this.addSql(
            'alter table `courses_topics` drop foreign key `courses_topics_course_id_foreign`;',
        );

        this.addSql(
            'alter table `ratings` drop foreign key `ratings_course_id_foreign`;',
        );

        this.addSql(
            'alter table `users_contributed_courses` drop foreign key `users_contributed_courses_course_id_foreign`;',
        );

        this.addSql(
            'alter table `users_courses` drop foreign key `users_courses_course_id_foreign`;',
        );

        this.addSql(
            'alter table `users_roles` drop foreign key `users_roles_role_id_foreign`;',
        );

        this.addSql(
            'alter table `download_items` drop foreign key `download_items_topic_id_foreign`;',
        );

        this.addSql(
            'alter table `courses_topics` drop foreign key `courses_topics_topic_id_foreign`;',
        );

        this.addSql(
            'alter table `videos` drop foreign key `videos_topic_id_foreign`;',
        );

        this.addSql(
            'alter table `ratings` drop foreign key `ratings_user_id_foreign`;',
        );

        this.addSql(
            'alter table `access_tokens` drop foreign key `access_tokens_user_id_foreign`;',
        );

        this.addSql(
            'alter table `users_contributed_courses` drop foreign key `users_contributed_courses_user_id_foreign`;',
        );

        this.addSql(
            'alter table `users_courses` drop foreign key `users_courses_user_id_foreign`;',
        );

        this.addSql(
            'alter table `users_roles` drop foreign key `users_roles_user_id_foreign`;',
        );

        this.addSql('drop table if exists `categories`;');

        this.addSql('drop table if exists `course_statuses`;');

        this.addSql('drop table if exists `courses`;');

        this.addSql('drop table if exists `courses_subcategories`;');

        this.addSql('drop table if exists `roles`;');

        this.addSql('drop table if exists `topics`;');

        this.addSql('drop table if exists `download_items`;');

        this.addSql('drop table if exists `courses_topics`;');

        this.addSql('drop table if exists `users`;');

        this.addSql('drop table if exists `ratings`;');

        this.addSql('drop table if exists `access_tokens`;');

        this.addSql('drop table if exists `users_contributed_courses`;');

        this.addSql('drop table if exists `users_courses`;');

        this.addSql('drop table if exists `users_roles`;');

        this.addSql('drop table if exists `videos`;');
    }
}
